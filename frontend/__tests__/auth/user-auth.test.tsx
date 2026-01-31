import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../../../user-website/src/pages/Login';
import Signup from '../../../user-website/src/pages/Signup';
import api from '../../../user-website/src/lib/apiClient';

// Mock API
vi.mock('../../../user-website/src/lib/apiClient');

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useSearchParams: () => [new URLSearchParams()],
    };
});

describe('User Authentication - Signup Flow', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    describe('Happy Path', () => {
        it('should successfully sign up new user', async () => {
            render(
                <BrowserRouter>
                    <Signup />
                </BrowserRouter>
            );

            const nameInput = screen.getByPlaceholder(/full name/i);
            const emailInput = screen.getByPlaceholderText(/email/i);
            const phoneInput = screen.getByPlaceholderText(/phone/i);
            const passwordInput = screen.getAllByPlaceholderText(/•/)[0]; // First password field
            const confirmPasswordInput = screen.getAllByPlaceholderText(/•/)[1]; // Confirm field

            fireEvent.change(nameInput, { target: { value: 'John Doe' } });
            fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
            fireEvent.change(phoneInput, { target: { value: '9876543210' } });
            fireEvent.change(passwordInput, { target: { value: 'StrongPass123!' } });
            fireEvent.change(confirmPasswordInput, { target: { value: 'StrongPass123!' } });

            const mockToken = 'mock-signup-token';
            api.post.mockResolvedValueOnce({
                data: {
                    access_token: mockToken,
                    user: {
                        id: 'user-123',
                        email: 'john@example.com',
                        name: 'John Doe',
                    },
                },
            });

            const signupButton = screen.getByRole('button', { name: /create account|sign up/i });
            fireEvent.click(signupButton);

            await waitFor(() => {
                expect(api.post).toHaveBeenCalledWith('/auth/signup', {
                    name: 'John Doe',
                    email: 'john@example.com',
                    phoneNumber: '9876543210',
                    password: 'StrongPass123!',
                    role: 'user',
                });
                expect(localStorage.getItem('token')).toBe(mockToken);
            });
        });
    });

    describe('Password Validation', () => {
        it('should enforce 12-character minimum password', async () => {
            render(
                <BrowserRouter>
                    <Signup />
                </BrowserRouter>
            );

            const passwordInput = screen.getAllByPlaceholderText(/•/)[0];
            fireEvent.change(passwordInput, { target: { value: 'Short1!' } });

            const signupButton = screen.getByRole('button', { name: /create account|sign up/i });
            fireEvent.click(signupButton);

            await waitFor(() => {
                expect(screen.getByText(/12 characters/i)).toBeInTheDocument();
            });
        });

        it('should show password strength meter', async () => {
            render(
                <BrowserRouter>
                    <Signup />
                </BrowserRouter>
            );

            const passwordInput = screen.getAllByPlaceholderText(/•/)[0];
            fireEvent.change(passwordInput, { target: { value: 'W' } });

            expect(screen.getByText(/weak/i)).toBeInTheDocument();

            fireEvent.change(passwordInput, { target: { value: 'WeakPassword1' } });
            expect(screen.getByText(/medium|moderate/i)).toBeInTheDocument();

            fireEvent.change(passwordInput, { target: { value: 'StrongPassword123!' } });
            expect(screen.getByText(/strong/i)).toBeInTheDocument();
        });

        it('should validate password confirmation match', async () => {
            render(
                <BrowserRouter>
                    <Signup />
                </BrowserRouter>
            );

            const passwordInput = screen.getAllByPlaceholderText(/•/)[0];
            const confirmPasswordInput = screen.getAllByPlaceholderText(/•/)[1];

            fireEvent.change(passwordInput, { target: { value: 'StrongPass123!' } });
            fireEvent.change(confirmPasswordInput, { target: { value: 'DifferentPass123!' } });

            const signupButton = screen.getByRole('button', { name: /create account|sign up/i });
            fireEvent.click(signupButton);

            await waitFor(() => {
                expect(screen.getByText(/passwords.*match/i)).toBeInTheDocument();
            });
        });
    });

    describe('Form Validation', () => {
        it('should validate required fields', async () => {
            render(
                <BrowserRouter>
                    <Signup />
                </BrowserRouter>
            );

            const signupButton = screen.getByRole('button', { name: /create account|sign up/i });
            fireEvent.click(signupButton);

            await waitFor(() => {
                const requiredErrors = screen.getAllByText(/required/i);
                expect(requiredErrors.length).toBeGreaterThan(0);
            });
        });

        it('should validate email format', async () => {
            render(
                <BrowserRouter>
                    <Signup />
                </BrowserRouter>
            );

            const emailInput = screen.getByPlaceholderText(/email/i);
            fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
            fireEvent.blur(emailInput);

            await waitFor(() => {
                expect(screen.getByText(/valid email/i)).toBeInTheDocument();
            });
        });

        it('should validate phone number format', async () => {
            render(
                <BrowserRouter>
                    <Signup />
                </BrowserRouter>
            );

            const phoneInput = screen.getByPlaceholderText(/phone/i);
            fireEvent.change(phoneInput, { target: { value: '123' } });
            fireEvent.blur(phoneInput);

            await waitFor(() => {
                expect(screen.getByText(/valid phone/i)).toBeInTheDocument();
            });
        });
    });

    describe('Error Handling', () => {
        it('should show error for duplicate email', async () => {
            render(
                <BrowserRouter>
                    <Signup />
                </BrowserRouter>
            );

            // Fill form
            fireEvent.change(screen.getByPlaceholder(/full name/i), {
                target: { value: 'John Doe' },
            });
            fireEvent.change(screen.getByPlaceholderText(/email/i), {
                target: { value: 'existing@example.com' },
            });
            fireEvent.change(screen.getByPlaceholderText(/phone/i), {
                target: { value: '9876543210' },
            });
            fireEvent.change(screen.getAllByPlaceholderText(/•/)[0], {
                target: { value: 'StrongPass123!' },
            });
            fireEvent.change(screen.getAllByPlaceholderText(/•/)[1], {
                target: { value: 'StrongPass123!' },
            });

            api.post.mockRejectedValueOnce({
                response: {
                    status: 409,
                    data: { message: 'Email already exists' },
                },
            });

            const signupButton = screen.getByRole('button', { name: /create account|sign up/i });
            fireEvent.click(signupButton);

            await waitFor(() => {
                expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
            });
        });
    });
});

describe('User Authentication - Login Flow', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    describe('Happy Path', () => {
        it('should successfully login user', async () => {
            render(
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            );

            const emailInput = screen.getByPlaceholderText(/email/i);
            const passwordInput = screen.getByPlaceholderText(/•/);

            fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'UserPassword123!' } });

            const mockToken = 'mock-user-token';
            api.post.mockResolvedValueOnce({
                data: {
                    access_token: mockToken,
                    user: {
                        id: 'user-123',
                        email: 'user@example.com',
                        role: 'user',
                    },
                },
            });

            const loginButton = screen.getByRole('button', { name: /sign in/i });
            fireEvent.click(loginButton);

            await waitFor(() => {
                expect(api.post).toHaveBeenCalledWith('/auth/login', {
                    email: 'user@example.com',
                    password: 'UserPassword123!',
                });
                expect(localStorage.getItem('token')).toBe(mockToken);
                expect(mockNavigate).toHaveBeenCalledWith('/');
            });
        });

        it('should show success message before redirect', async () => {
            render(
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            );

            const emailInput = screen.getByPlaceholderText(/email/i);
            const passwordInput = screen.getByPlaceholderText(/•/);

            fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

            api.post.mockResolvedValueOnce({
                data: {
                    access_token: 'token',
                    user: { id: '123', role: 'user' },
                },
            });

            const loginButton = screen.getByRole('button', { name: /sign in/i });
            fireEvent.click(loginButton);

            await waitFor(() => {
                expect(screen.getByText(/login successful/i)).toBeInTheDocument();
            });
        });
    });

    describe('Social Login', () => {
        it('should initiate Google OAuth flow', async () => {
            const originalLocation = window.location;
            delete (window as any).location;
            window.location = { ...originalLocation, href: '' } as any;

            render(
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            );

            const googleButton = screen.getByText(/continue with google/i);
            fireEvent.click(googleButton);

            expect(window.location.href).toContain('/auth/google');

            window.location = originalLocation;
        });

        it('should initiate GitHub OAuth flow', async () => {
            const originalLocation = window.location;
            delete (window as any).location;
            window.location = { ...originalLocation, href: '' } as any;

            render(
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            );

            const githubButton = screen.getByText(/continue with github/i);
            fireEvent.click(githubButton);

            expect(window.location.href).toContain('/auth/github');

            window.location = originalLocation;
        });

        it('should handle OAuth callback with token', async () => {
            const mockSearchParams = new URLSearchParams('?token=oauth-token-123');

            vi.mocked(useSearchParams).mockReturnValue([mockSearchParams, vi.fn()]);

            render(
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            );

            await waitFor(() => {
                expect(localStorage.getItem('token')).toBe('oauth-token-123');
                expect(screen.getByText(/login successful/i)).toBeInTheDocument();
            });
        });
    });

    describe('Remember Me', () => {
        it('should save email when remember me is checked', async () => {
            render(
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            );

            const emailInput = screen.getByPlaceholderText(/email/i);
            const passwordInput = screen.getByPlaceholderText(/•/);
            const rememberCheckbox = screen.getByRole('checkbox', { name: /remember/i });

            fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
            fireEvent.click(rememberCheckbox);

            api.post.mockResolvedValueOnce({
                data: {
                    access_token: 'token',
                    user: { id: '123', role: 'user' },
                },
            });

            const loginButton = screen.getByRole('button', { name: /sign in/i });
            fireEvent.click(loginButton);

            await waitFor(() => {
                expect(localStorage.getItem('user_email')).toBe('user@example.com');
            });
        });
    });

    describe('Error Messages', () => {
        it('should show helpful error for invalid credentials', async () => {
            render(
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            );

            api.post.mockRejectedValueOnce({
                response: {
                    status: 401,
                    data: { message: 'Invalid credentials' },
                },
            });

            fireEvent.change(screen.getByPlaceholderText(/email/i), {
                target: { value: 'wrong@example.com' },
            });
            fireEvent.change(screen.getByPlaceholderText(/•/), {
                target: { value: 'WrongPassword123!' },
            });

            fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

            await waitFor(() => {
                expect(screen.getByText(/invalid.*password/i)).toBeInTheDocument();
                expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
            });
        });
    });
});
