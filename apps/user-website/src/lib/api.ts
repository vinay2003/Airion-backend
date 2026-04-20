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
    const response = await api.get('/services', { params: filters });
    // Assuming backend returns an array due to interceptor unwrapping {success, data}
    const servicesList = Array.isArray(response.data) ? response.data : [];
    return servicesList.map(mapServiceToEvent);
};

export const fetchEventById = async (id: string): Promise<Event | undefined> => {
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
