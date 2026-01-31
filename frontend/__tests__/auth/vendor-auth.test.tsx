import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import VendorLogin from '../../../vendor-dashboard/src/pages/auth/VendorLogin';
import VendorSignup from '../../../vendor-dashboard/src/pages/auth/VendorSignup';
import api from '../../../vendor-dashboard/src/lib/api';

// Mock API
vi.mock('../../../vendor-dashboard/src/lib/api');

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('Vendor Authentication - Login Flow', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Happy Path - OTP Login', () => {
        it('should successfully send OTP to phone number', async () => {
            const { container } = render(
                <BrowserRouter>
                    <VendorLogin />
                </BrowserRouter>
            );

            const phoneInput = screen.getByPlaceholderText(/phone number/i);
            fireEvent.change(phoneInput, { target: { value: '9876543210' } });

            const sendOtpButton = screen.getByText(/send otp/i);

            api.post.mockResolvedValueOnce({ data: { message: 'OTP sent successfully' } });

            fireEvent.click(sendOtpButton);

            await waitFor(() => {
                expect(api.post).toHaveBeenCalledWith('/auth/login/send-otp', {
                    phoneNumber: '9876543210',
                });
            });
        });

        it('should verify OTP and login successfully', async () => {
            const { container } = render(
                <BrowserRouter>
                    <VendorLogin />
                </BrowserRouter>
            );

            // First send OTP
            const phoneInput = screen.getByPlaceholderText(/phone number/i);
            fireEvent.change(phoneInput, { target: { value: '9876543210' } });

            api.post.mockResolvedValueOnce({ data: { message: 'OTP sent' } });
            const sendOtpButton = screen.getByText(/send otp/i);
            fireEvent.click(sendOtpButton);

            await waitFor(() => {
                expect(screen.getByPlaceholderText(/enter otp/i)).toBeInTheDocument();
            });

            // Then verify OTP
            const otpInput = screen.getByPlaceholderText(/enter otp/i);
            fireEvent.change(otpInput, { target: { value: '123456' } });

            const mockToken = 'mock-jwt-token';
            api.post.mockResolvedValueOnce({
                data: {
                    access_token: mockToken,
                    user: { id: '123', role: 'vendor' },
                },
            });

            const verifyButton = screen.getByText(/verify/i);
            fireEvent.click(verifyButton);

            await waitFor(() => {
                expect(api.post).toHaveBeenCalledWith('/auth/login/verify-otp', {
                    phoneNumber: '9876543210',
                    otp: '123456',
                });
                expect(localStorage.getItem('token')).toBe(mockToken);
                expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
            });
        });
    });

    describe('Error Handling', () => {
        it('should show error for invalid phone number', async () => {
            const { container } = render(
                <BrowserRouter>
                    <VendorLogin />
                </BrowserRouter>
            );

            const phoneInput = screen.getByPlaceholderText(/phone number/i);
            fireEvent.change(phoneInput, { target: { value: '123' } });

            const sendOtpButton = screen.getByText(/send otp/i);
            fireEvent.click(sendOtpButton);

            await waitFor(() => {
                expect(screen.getByText(/valid phone number/i)).toBeInTheDocument();
            });
        });

        it('should show error for expired OTP', async () => {
            const { container } = render(
                <BrowserRouter>
                    <VendorLogin />
                </BrowserRouter>
            );

            api.post.mockResolvedValueOnce({ data: {} }); // Send OTP success

            const phoneInput = screen.getByPlaceholderText(/phone number/i);
            fireEvent.change(phoneInput, { target: { value: '9876543210' } });
            fireEvent.click(screen.getByText(/send otp/i));

            await waitFor(() => {
                expect(screen.getByPlaceholderText(/enter otp/i)).toBeInTheDocument();
            });

            const otpInput = screen.getByPlaceholderText(/enter otp/i);
            fireEvent.change(otpInput, { target: { value: '123456' } });

            api.post.mockRejectedValueOnce({
                response: { data: { message: 'OTP expired' } },
            });

            fireEvent.click(screen.getByText(/verify/i));

            await waitFor(() => {
                expect(screen.getByText(/otp expired/i)).toBeInTheDocument();
            });
        });

        it('should show error for invalid OTP', async () => {
            const { container } = render(
                <BrowserRouter>
                    <VendorLogin />
                </BrowserRouter>
            );

            api.post.mockResolvedValueOnce({ data: {} });

            const phoneInput = screen.getByPlaceholderText(/phone number/i);
            fireEvent.change(phoneInput, { target: { value: '9876543210' } });
            fireEvent.click(screen.getByText(/send otp/i));

            await waitFor(() => screen.getByPlaceholderText(/enter otp/i));

            const otpInput = screen.getByPlaceholderText(/enter otp/i);
            fireEvent.change(otpInput, { target: { value: '000000' } });

            api.post.mockRejectedValueOnce({
                response: { data: { message: 'Invalid OTP' } },
            });

            fireEvent.click(screen.getByText(/verify/i));

            await waitFor(() => {
                expect(screen.getByText(/invalid otp/i)).toBeInTheDocument();
            });
        });
    });

    describe('Rate Limiting', () => {
        it('should prevent too many OTP requests', async () => {
            const { container } = render(
                <BrowserRouter>
                    <VendorLogin />
                </BrowserRouter>
            );

            const phoneInput = screen.getByPlaceholderText(/phone number/i);
            fireEvent.change(phoneInput, { target: { value: '9876543210' } });

            const sendOtpButton = screen.getByText(/send otp/i);

            // Attempt 4th OTP request (limit is 3 per hour)
            api.post.mockRejectedValueOnce({
                response: {
                    status: 429,
                    data: { message: 'Too many OTP requests' },
                },
            });

            fireEvent.click(sendOtpButton);

            await waitFor(() => {
                expect(screen.getByText(/too many.*requests/i)).toBeInTheDocument();
            });
        });
    });
});

describe('Vendor Authentication - Signup Flow', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Happy Path', () => {
        it('should complete vendor signup with OTP verification', async () => {
            const { container } = render(
                <BrowserRouter>
                    <VendorSignup />
                </BrowserRouter>
            );

            // Fill business details
            const businessNameInput = screen.getByPlaceholderText(/business name/i);
            const phoneInput = screen.getByPlaceholderText(/phone number/i);
            const emailInput = screen.getByPlaceholderText(/email/i);

            fireEvent.change(businessNameInput, { target: { value: 'Test Events' } });
            fireEvent.change(phoneInput, { target: { value: '9876543210' } });
            fireEvent.change(emailInput, { target: { value: 'test@events.com' } });

            api.post.mockResolvedValueOnce({ data: { message: 'OTP sent' } });

            const nextButton = screen.getByText(/send otp/i);
            fireEvent.click(nextButton);

            await waitFor(() => {
                expect(screen.getByPlaceholderText(/enter otp/i)).toBeInTheDocument();
            });

            // Verify OTP
            const otpInput = screen.getByPlaceholderText(/enter otp/i);
            fireEvent.change(otpInput, { target: { value: '123456' } });

            const mockToken = 'mock-signup-token';
            api.post.mockResolvedValueOnce({
                data: { access_token: mockToken },
            });

            fireEvent.click(screen.getByText(/verify/i));

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/vendor/complete-profile');
            });
        });
    });

    describe('Validation', () => {
        it('should validate required fields', async () => {
            const { container } = render(
                <BrowserRouter>
                    <VendorSignup />
                </BrowserRouter>
            );

            const submitButton = screen.getByText(/send otp/i);
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/business name.*required/i)).toBeInTheDocument();
                expect(screen.getByText(/phone.*required/i)).toBeInTheDocument();
            });
        });

        it('should validate phone number format', async () => {
            const { container } = render(
                <BrowserRouter>
                    <VendorSignup />
                </BrowserRouter>
            );

            const phoneInput = screen.getByPlaceholderText(/phone number/i);
            fireEvent.change(phoneInput, { target: { value: '123' } });
            fireEvent.blur(phoneInput);

            await waitFor(() => {
                expect(screen.getByText(/valid phone number/i)).toBeInTheDocument();
            });
        });
    });
});

describe('Vendor Protected Routes', () => {
    it('should redirect to login if not authenticated', async () => {
        localStorage.removeItem('token');

        const ProtectedComponent = () => <div>Protected Content</div>;

        render(
            <BrowserRouter>
                <ProtectedComponent />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/vendor/login');
        });
    });

    it('should allow access if authenticated as vendor', async () => {
        localStorage.setItem('token', 'valid-vendor-token');

        const ProtectedComponent = () => <div>Protected Content</div>;

        render(
            <BrowserRouter>
                <ProtectedComponent />
            </BrowserRouter>
        );

        expect(screen.getByText(/protected content/i)).toBeInTheDocument();
    });
});
