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
    try {
        const response = await api.get('/services', { params: filters });
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
            return response.data.map(mapServiceToEvent);
        }
    } catch (err) {
        console.warn('API fetch failed, using mock fallbacks');
    }

    // Fallback Mock Data for testing and development
    const mockServices = [
        {
            id: 'mock-1',
            vendorId: 'v-1',
            title: 'Royal Wedding Venue',
            category: 'Wedding',
            image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1000',
            images: [],
            rating: 4.9,
            location: 'Jabalpur, Madhya Pradesh',
            reviews: 156,
            price: '₹2,50,000',
            capacity: '500 Guests',
            description: 'Luxury wedding destination in Jabalpur with full amenities.'
        },
        {
            id: 'mock-2',
            vendorId: 'v-2',
            title: 'Corporate Plaza',
            category: 'Corporate',
            image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1000',
            images: [],
            rating: 4.7,
            location: 'Mumbai, Maharashtra',
            reviews: 89,
            price: '₹1,20,000',
            capacity: '150 Guests',
            description: 'Professional space for corporate events and seminars.'
        },
        {
            id: 'mock-3',
            vendorId: 'v-3',
            title: 'The Party Garden',
            category: 'Birthday',
            image: 'https://images.unsplash.com/photo-1530103862676-de3c9a59af57?q=80&w=1000',
            images: [],
            rating: 4.5,
            location: 'Goa',
            reviews: 210,
            price: '₹75,000',
            capacity: '100 Guests',
            description: 'Beautiful garden venue for birthdays and private parties.'
        },
        {
            id: 'mock-4',
            vendorId: 'v-4',
            title: 'Elegance Banquet',
            category: 'Wedding',
            image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000',
            images: [],
            rating: 4.8,
            location: 'Jabalpur',
            reviews: 45,
            price: '₹3,00,000',
            capacity: '250 Guests',
            description: 'Premium banquet hall in Jabalpur center.'
        }
    ];

    return (mockServices as any[]).map(s => ({
        ...s,
        price: typeof s.price === 'string' ? s.price : `INR ${s.price}`
    }));
};

export const fetchEventById = async (id: string): Promise<Event | undefined> => {
    // Intercept mock package IDs to ensure packages flow correctly without DB data
    if (['1', '2', '3'].includes(id)) {
        const mockPackages = [
            {
                id: '1',
                vendorId: 'mock-vendor-1',
                title: 'Royal Wedding Gold Package',
                category: 'Wedding',
                image: 'https://images.unsplash.com/photo-1756190564669-215843660e93?w=600&auto=format&fit=crop&q=60',
                images: [],
                rating: 5.0,
                location: 'Grand Hotel Ballroom, Premium Venue',
                reviews: 120,
                price: '₹5,00,000',
                capacity: '500 Guests',
                description: 'A complete wedding solution including premium venue, catering for 500 guests, and gold-class decor. Highlights: Luxury Venue, Premium Catering, 4K Cinematography, and Floral Decor.'
            },
            {
                id: '2',
                vendorId: 'mock-vendor-2',
                title: 'Intimate Birthday Bash',
                category: 'Birthday',
                image: 'https://images.unsplash.com/photo-1744216615372-bbc32acf92c5?w=600&auto=format&fit=crop&q=60',
                images: [],
                rating: 4.8,
                location: 'Sunset Cafe Rooftop, Goa',
                reviews: 85,
                price: '₹50,000',
                capacity: '50 Guests',
                description: 'Perfect for small gatherings and birthday celebrations with close friends and family. Features balloon decorations, custom cake, and sunset views.'
            },
            {
                id: '3',
                vendorId: 'mock-vendor-3',
                title: 'Corporate Seminar Basic',
                category: 'Corporate',
                image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1000&auto=format&fit=crop',
                images: [],
                rating: 4.6,
                location: 'City Conference Hall, Tech Hub',
                reviews: 200,
                price: '₹1,00,000',
                capacity: '100 Guests',
                description: 'Standard package for corporate meetings and seminars. Includes projector, premium sound system, dedicated event coordinator and fast Wi-Fi.'
            }
        ];
        return mockPackages.find(p => p.id === id) as Event;
    }

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
