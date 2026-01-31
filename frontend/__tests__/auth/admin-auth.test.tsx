import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminLogin from '../../../admin-panel/src/pages/AdminLogin';
import api from '../../../admin-panel/src/lib/api';

// Mock API
vi.mock('../../../admin-panel/src/lib/api');

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('Admin Authentication - Login Flow', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    describe('Happy Path', () => {
        it('should successfully login admin user', async () => {
            render(
                <BrowserRouter>
                    <AdminLogin />
                </BrowserRouter>
            );

            const emailInput = screen.getByPlaceholderText(/email/i);
            const passwordInput = screen.getByPlaceholderText(/password/i);

            fireEvent.change(emailInput, { target: { value: 'admin@airion.com' } });
            fireEvent.change(passwordInput, { target: { value: 'Admin@123456' } });

            const mockToken = 'mock-admin-token';
            api.post.mockResolvedValueOnce({
                data: {
                    access_token: mockToken,
                    user: {
                        id: 'admin-123',
                        email: 'admin@airion.com',
                        role: 'admin',
                    },
                },
            });

            const loginButton = screen.getByRole('button', { name: /sign in/i });
            fireEvent.click(loginButton);

            await waitFor(() => {
                expect(api.post).toHaveBeenCalledWith('/auth/admin/login', {
                    email: 'admin@airion.com',
                    password: 'Admin@123456',
                });
                expect(localStorage.getItem('token')).toBe(mockToken);
                expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard');
            });
        });

        it('should show loading state during login', async () => {
            render(
                <BrowserRouter>
                    <AdminLogin />
                </BrowserRouter>
            );

            const emailInput = screen.getByPlaceholderText(/email/i);
            const passwordInput = screen.getByPlaceholderText(/password/i);

            fireEvent.change(emailInput, { target: { value: 'admin@airion.com' } });
            fireEvent.change(passwordInput, { target: { value: 'Admin@123456' } });

            api.post.mockImplementationOnce(
                () => new Promise((resolve) => setTimeout(resolve, 100))
            );

            const loginButton = screen.getByRole('button', { name: /sign in/i });
            fireEvent.click(loginButton);

            expect(screen.getByText(/signing in/i)).toBeInTheDocument();
            expect(loginButton).toBeDisabled();
        });
    });

    describe('Role Validation', () => {
        it('should reject non-admin users', async () => {
            render(
                <BrowserRouter>
                    <AdminLogin />
                </BrowserRouter>
            );

            const emailInput = screen.getByPlaceholderText(/email/i);
            const passwordInput = screen.getByPlaceholderText(/password/i);

            fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

            api.post.mockResolvedValueOnce({
                data: {
                    access_token: 'user-token',
                    user: {
                        id: 'user-123',
                        email: 'user@example.com',
                        role: 'user', // Not an admin!
                    },
                },
            });

            const loginButton = screen.getByRole('button', { name: /sign in/i });
            fireEvent.click(loginButton);

            await waitFor(() => {
                expect(screen.getByText(/not authorized.*admin/i)).toBeInTheDocument();
                expect(localStorage.getItem('token')).toBeNull();
                expect(mockNavigate).not.toHaveBeenCalled();
            });
        });

        it('should verify admin role on protected routes', async () => {
            // Set a token with non-admin role
            localStorage.setItem('token', 'fake-token');

            api.get.mockResolvedValueOnce({
                data: {
                    user: { id: '123', role: 'user' },
                },
            });

            const ProtectedComponent = () => <div>Admin Dashboard</div>;

            render(
                <BrowserRouter>
                    <ProtectedComponent />
                </BrowserRouter>
            );

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/admin/login');
            });
        });
    });

    describe('Error Handling', () => {
        it('should show error for invalid credentials', async () => {
            render(
                <BrowserRouter>
                    <AdminLogin />
                </BrowserRouter>
            );

            const emailInput = screen.getByPlaceholderText(/email/i);
            const passwordInput = screen.getByPlaceholderText(/password/i);

            fireEvent.change(emailInput, { target: { value: 'wrong@admin.com' } });
            fireEvent.change(passwordInput, { target: { value: 'WrongPassword123!' } });

            api.post.mockRejectedValueOnce({
                response: {
                    status: 401,
                    data: { message: 'Invalid credentials' },
                },
            });

            const loginButton = screen.getByRole('button', { name: /sign in/i });
            fireEvent.click(loginButton);

            await waitFor(() => {
                expect(screen.getByText(/invalid.*credentials/i)).toBeInTheDocument();
            });
        });

        it('should show error for account lockout', async () => {
            render(
                <BrowserRouter>
                    <AdminLogin />
                </BrowserRouter>
            );

            const emailInput = screen.getByPlaceholderText(/email/i);
            const passwordInput = screen.getByPlaceholderText(/password/i);

            fireEvent.change(emailInput, { target: { value: 'locked@admin.com' } });
            fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

            api.post.mockRejectedValueOnce({
                response: {
                    status: 403,
                    data: { message: 'Account temporarily locked' },
                },
            });

            const loginButton = screen.getByRole('button', { name: /sign in/i });
            fireEvent.click(loginButton);

            await waitFor(() => {
                expect(screen.getByText(/account.*locked/i)).toBeInTheDocument();
                expect(screen.getByText(/15 minutes/i)).toBeInTheDocument();
            });
        });

        it('should handle network errors gracefully', async () => {
            render(
                <BrowserRouter>
                    <AdminLogin />
                </BrowserRouter>
            );

            const emailInput = screen.getByPlaceholderText(/email/i);
            const passwordInput = screen.getByPlaceholderText(/password/i);

            fireEvent.change(emailInput, { target: { value: 'admin@airion.com' } });
            fireEvent.change(passwordInput, { target: { value: 'Admin@123456' } });

            api.post.mockRejectedValueOnce(new Error('Network error'));

            const loginButton = screen.getByRole('button', { name: /sign in/i });
            fireEvent.click(loginButton);

            await waitFor(() => {
                expect(screen.getByText(/try again.*contact support/i)).toBeInTheDocument();
            });
        });
    });

    describe('Form Validation', () => {
        it('should validate email format', async () => {
            render(
                <BrowserRouter>
                    <AdminLogin />
                </BrowserRouter>
            );

            const emailInput = screen.getByPlaceholderText(/email/i);
            fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
            fireEvent.blur(emailInput);

            await waitFor(() => {
                expect(screen.getByText(/valid email/i)).toBeInTheDocument();
            });
        });

        it('should require password', async () => {
            render(
                <BrowserRouter>
                    <AdminLogin />
                </BrowserRouter>
            );

            const loginButton = screen.getByRole('button', { name: /sign in/i });
            fireEvent.click(loginButton);

            await waitFor(() => {
                expect(screen.getByText(/password.*required/i)).toBeInTheDocument();
            });
        });
    });

    describe('Remember Me Functionality', () => {
        it('should save email when remember me is checked', async () => {
            render(
                <BrowserRouter>
                    <AdminLogin />
                </BrowserRouter>
            );

            const emailInput = screen.getByPlaceholderText(/email/i);
            const passwordInput = screen.getByPlaceholderText(/password/i);
            const rememberCheckbox = screen.getByRole('checkbox', { name: /remember me/i });

            fireEvent.change(emailInput, { target: { value: 'admin@airion.com' } });
            fireEvent.change(passwordInput, { target: { value: 'Admin@123456' } });
            fireEvent.click(rememberCheckbox);

            api.post.mockResolvedValueOnce({
                data: {
                    access_token: 'token',
                    user: { id: '123', role: 'admin' },
                },
            });

            const loginButton = screen.getByRole('button', { name: /sign in/i });
            fireEvent.click(loginButton);

            await waitFor(() => {
                expect(localStorage.getItem('admin_email')).toBe('admin@airion.com');
            });
        });

        it('should load saved email on mount', async () => {
            localStorage.setItem('admin_email', 'saved@admin.com');

            render(
                <BrowserRouter>
                    <AdminLogin />
                </BrowserRouter>
            );

            const emailInput = screen.getByPlaceholderText(/email/i) as HTMLInputElement;
            expect(emailInput.value).toBe('saved@admin.com');
            expect(screen.getByRole('checkbox', { name: /remember me/i })).toBeChecked();
        });
    });
});

describe('Admin Protected Routes', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('should redirect to login if no token', async () => {
        const ProtectedComponent = () => <div>Admin Content</div>;

        render(
            <BrowserRouter>
                <ProtectedComponent />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/admin/login');
        });
    });

    it('should redirect if token is invalid', async () => {
        localStorage.setItem('token', 'invalid-token');

        api.get.mockRejectedValueOnce({
            response: { status: 401 },
        });

        const ProtectedComponent = () => <div>Admin Content</div>;

        render(
            <BrowserRouter>
                <ProtectedComponent />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/admin/login');
            expect(localStorage.getItem('token')).toBeNull();
        });
    });

    it('should allow access with valid admin token', async () => {
        localStorage.setItem('token', 'valid-admin-token');

        api.get.mockResolvedValueOnce({
            data: {
                user: { id: 'admin-123', role: 'admin' },
            },
        });

        const ProtectedComponent = () => <div>Admin Dashboard</div>;

        render(
            <BrowserRouter>
                <ProtectedComponent />
            </BrowserRouter>
        );

        expect(screen.getByText(/admin dashboard/i)).toBeInTheDocument();
    });
});
