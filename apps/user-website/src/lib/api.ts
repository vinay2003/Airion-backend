import type { Event } from '../types';
import axios from 'axios';

const mapServiceToEvent = (service: any): Event => {
    return {
        id: service.id,
        vendorId: service.vendorId,
        title: service.title,
        category: service.category?.name || 'Uncategorized',
        image: service.images?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80', // Fallback
        images: service.images || [],
        rating: service.vendor?.rating || 4.5,
        location: service.availableLocations?.[0] || 'Mumbai',
        reviews: service.vendor?.totalReviews || 0,
        price: `${service.currency || 'INR'} ${parseFloat(service.basePrice).toLocaleString()}`,
        capacity: 'Contact Vendor',
        description: service.description || '',
    };
};


// Create axios instance with base URL
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000/api' : 'https://airion-backend.onrender.com/api'),
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for debugging and auth
api.interceptors.request.use(
    (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);

        // Add auth token if available
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling and standardizing wrapped API responses
api.interceptors.response.use(
    (response) => {
        // Automatically unwrap NestJS standardization { success, data, message }
        if (response.data && response.data.success === true && response.data.data !== undefined) {
            response.data = response.data.data;
        }
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem('token');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);


export default api;

import { events as mockEvents } from '../data/events';

export const fetchEvents = async (): Promise<Event[]> => {
    // Return mock data instantly for Vercel deployment performance
    return mockEvents as any[];
};

export const fetchEventById = async (id: string): Promise<Event | undefined> => {
    // Return mock data instantly for Vercel deployment performance
    return mockEvents.find(e => e.id === id) as any;
};

/**
 * Booking API Helpers
 */
export const createBooking = async (bookingData: any) => {
    const response = await api.post('/bookings', bookingData);
    return response.data; // { success, booking }
};

export const fetchMyBookings = async () => {
    const response = await api.get('/bookings/mine');
    return response.data;
};

/**
 * Payment API Helpers
 */
export const createPaymentOrder = async (amount: number, bookingId: string) => {
    const response = await api.post('/payments/create-order', { amount, bookingId });
    return response.data; // { success, orderId, amount, currency }
};

export const verifyPayment = async (verificationResponse: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }, bookingId: string) => {
    const response = await api.post('/payments/verify', { ...verificationResponse, bookingId });
    return response.data; // { success }
};

