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

/**
 * 🔹 Global Dummy Events for Marketplace Categories
 * These ensure that "Parties" and "Corporate" sections are never empty.
 */
export const GLOBAL_DUMMY_EVENTS: Event[] = [
    {
        id: 'dummy-party-1',
        title: 'Neon Sky Rooftop Gala',
        category: 'Parties',
        image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1000&auto=format&fit=crop',
        rating: 4.9,
        reviews: 128,
        location: 'Worli, Mumbai',
        price: 'INR 45,000',
        description: 'An elite rooftop experience with panoramic views and premium mixology.',
        capacity: '50-150 Guests'
    },
    {
        id: 'dummy-party-2',
        title: 'Retro Disco Night',
        category: 'Parties',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000&auto=format&fit=crop',
        rating: 4.7,
        reviews: 84,
        location: 'Indiranagar, Bangalore',
        price: 'INR 25,000',
        description: 'Groove to the classics in a high-energy environment with vintage aesthetics.',
        capacity: '100-300 Guests'
    },
    {
        id: 'dummy-corp-1',
        title: 'Tech Summit 2024 Venue',
        category: 'Corporate',
        image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1000&auto=format&fit=crop',
        rating: 5.0,
        reviews: 45,
        location: 'Cyber City, Gurgaon',
        price: 'INR 1,20,000',
        description: 'State-of-the-art conference hal with advanced AV systems and high-speed fiber.',
        capacity: '500+ Guests'
    },
    {
        id: 'dummy-corp-2',
        title: 'Executive Leadership Retreat',
        category: 'Corporate',
        image: 'https://images.unsplash.com/photo-1540575861501-7ad060e39fe5?q=80&w=1000&auto=format&fit=crop',
        rating: 4.8,
        reviews: 32,
        location: 'Lonavala, Maharashtra',
        price: 'INR 85,000',
        description: 'Quiet, premium setting for strategic planning and executive bonding.',
        capacity: '20-50 Guests'
    }
];


// Create axios instance with base URL
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for debugging and auth
api.interceptors.request.use(
    (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);

        // Add auth token if available (using consistent key)
        const token = localStorage.getItem('ease2event_token');
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
    async (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem('ease2event_token');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);


export default api;

export const fetchEvents = async (filters: Record<string, any> = {}): Promise<Event[]> => {
    try {
        const response = await api.get('/services', { params: filters });
        const servicesList = Array.isArray(response.data) ? response.data : [];
        const mappedApiEvents = servicesList.map(mapServiceToEvent);
        
        // Merge with dummy events to ensure categories are populated
        return [...mappedApiEvents, ...GLOBAL_DUMMY_EVENTS];
    } catch (err) {
        console.error('Failed to fetch events from API, falling back to dummy data:', err);
        return GLOBAL_DUMMY_EVENTS;
    }
};

export const fetchEventById = async (id: string): Promise<Event | undefined> => {
    // Check dummy events first
    const dummy = GLOBAL_DUMMY_EVENTS.find(e => e.id === id);
    if (dummy) return dummy;

    try {
        const response = await api.get(`/services/${id}`);
        if (!response.data) return undefined;
        return mapServiceToEvent(response.data);
    } catch (e) {
        return undefined;
    }
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
/**
 * Wishlist API Helpers
 */
export const toggleWishlist = async (vendorId: string) => {
    const response = await api.post(`/wishlists/toggle/${vendorId}`);
    return response.data;
};

export const fetchMyWishlist = async () => {
    const response = await api.get('/wishlists/mine');
    return response.data;
};

/**
 * Budget API Helpers
 */
export const fetchBudget = async () => {
    const response = await api.get('/budget');
    return response.data;
};

export const updateBudget = async (budgetData: any) => {
    const response = await api.patch('/budget/update', budgetData);
    return response.data;
};

/**
 * Guests API Helpers
 */
export const fetchGuests = async () => {
    const response = await api.get('/guests');
    return response.data;
};

export const createGuest = async (guestData: any) => {
    const response = await api.post('/guests', guestData);
    return response.data;
};

export const updateGuest = async (id: string, guestData: any) => {
    const response = await api.patch(`/guests/${id}`, guestData);
    return response.data;
};

export const deleteGuest = async (id: string) => {
    const response = await api.delete(`/guests/${id}`);
    return response.data;
};

/**
 * Chat API Helpers
 */
export const fetchConversations = async () => {
    const response = await api.get('/chat/conversations');
    return response.data;
};

export const fetchMessages = async (conversationId: string) => {
    const response = await api.get(`/chat/messages/${conversationId}`);
    return response.data;
};

export const startConversation = async (vendorId: string) => {
    const response = await api.post('/chat/start', { vendorId });
    return response.data;
};

/**
 * User Profile & Uploads
 */
export const updateProfile = async (profileData: any) => {
    const response = await api.patch('/auth/profile', profileData);
    return response.data;
};

export const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/uploads/image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
