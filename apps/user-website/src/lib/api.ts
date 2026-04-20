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

const DUMMY_EVENTS: Event[] = [
    {
        id: 'd1',
        title: 'The Grand Imperial Ballroom',
        category: 'Venues',
        image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop',
        rating: 4.9,
        location: 'Mumbai, Maharashtra',
        reviews: 128,
        price: 'INR 2,50,000',
        capacity: '500-2000',
        description: 'An opulent ballroom standing as the pinnacle of luxury, perfect for royal weddings and corporate galas.'
    },
    {
        id: 'd2',
        title: 'Sunset Beach Resort & Spa',
        category: 'Venues',
        image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1200&auto=format&fit=crop',
        rating: 4.8,
        location: 'Goa, India',
        reviews: 215,
        price: 'INR 1,75,000',
        capacity: '100-800',
        description: 'Exquisite beachfront venue offering breathtaking sunset views and world-class service.'
    },
    {
        id: 'd3',
        title: 'Elite Gourmet Catering',
        category: 'Services',
        image: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200&auto=format&fit=crop',
        rating: 4.7,
        location: 'New Delhi, Delhi',
        reviews: 89,
        price: 'INR 1,200/Plate',
        capacity: 'Unlimited',
        description: 'Award-winning catering service specialized in multi-cuisine fine dining and experimental fusion.'
    },
    {
        id: 'd4',
        title: 'Signature Florals & Decor',
        category: 'Services',
        image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=1200&auto=format&fit=crop',
        rating: 4.9,
        location: 'Bangalore, Karnataka',
        reviews: 156,
        price: 'Starts INR 45,000',
        capacity: 'N/A',
        description: 'Premium floral arrangements and thematic decor concepts that transform spaces into dreamscapes.'
    },
    {
        id: 'd5',
        title: 'Himalayan Luxury Retreat',
        category: 'Experiences',
        image: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?q=80&w=1200&auto=format&fit=crop',
        rating: 5.0,
        location: 'Manali, Himachal Pradesh',
        reviews: 42,
        price: 'INR 85,000',
        capacity: '10-30',
        description: 'An exclusive mountain experience including private treks, bonfire nights, and high-altitude yoga.'
    },
    {
        id: 'd6',
        title: 'Vintage Yacht Party',
        category: 'Experiences',
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200&auto=format&fit=crop',
        rating: 4.6,
        location: 'Mumbai Harbor',
        reviews: 67,
        price: 'INR 1,10,000',
        capacity: '20-50',
        description: 'Celebrate your special moments on a luxury vintage yacht with panoramic skyline views.'
    },
    {
        id: 'd7',
        title: 'Sky Garden Terrace',
        category: 'Venues',
        image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1200&auto=format&fit=crop',
        rating: 4.7,
        location: 'Hyderbad, Telangana',
        reviews: 94,
        price: 'INR 95,000',
        capacity: '50-150',
        description: 'A modern rooftop garden venue with a stunning 360-degree city view, ideal for cocktail parties.'
    },
    {
        id: 'd8',
        title: 'Cinematic Wedding Films',
        category: 'Services',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop',
        rating: 4.9,
        location: 'Patna, Bihar',
        reviews: 53,
        price: 'Starts INR 1,50,000',
        capacity: 'Global',
        description: 'Capture your forever moments with high-end cinematic production and storytelling.'
    },
    {
        id: 'd9',
        title: 'The Royal Wedding Mahal',
        category: 'Weddings',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
        rating: 5.0,
        location: 'Udaipur, Rajasthan',
        reviews: 312,
        price: 'INR 5,00,000',
        capacity: '1000+',
        description: 'A majestic palace venue designed for the grandest wedding celebrations in the city of lakes.'
    },
    {
        id: 'd10',
        title: 'Neon Nights Party Arena',
        category: 'Parties',
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop',
        rating: 4.5,
        location: 'Mumbai, Maharashtra',
        reviews: 84,
        price: 'INR 45,000',
        capacity: '50-100',
        description: 'High-energy party venue with professional sound systems and spectacular light shows.'
    },
    {
        id: 'd11',
        title: 'Executive Summit Plaza',
        category: 'Corporate',
        image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=1200&auto=format&fit=crop',
        rating: 4.7,
        location: 'Gurgaon, Haryana',
        reviews: 145,
        price: 'INR 1,20,000',
        capacity: '200-500',
        description: 'Fully-equipped corporate center for seminars, conferences, and executive leadership retreats.'
    },
    {
        id: 'd12',
        title: 'Infinite Wedding Decors',
        category: 'Weddings',
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop',
        rating: 4.8,
        location: 'Delhi NCR',
        reviews: 212,
        price: 'Starts INR 80,000',
        capacity: 'N/A',
        description: 'Transforming your wedding vision into reality with bespoke floral and thematic decorations.'
    }
];

export const fetchEvents = async (filters: Record<string, any> = {}): Promise<Event[]> => {
    try {
        const response = await api.get('/services', { params: filters });
        const servicesList = Array.isArray(response.data) ? response.data : [];
        const fetchedEvents = servicesList.map(mapServiceToEvent);
        
        // Merge with dummy data for a "wowed" first look
        return [...fetchedEvents, ...DUMMY_EVENTS];
    } catch (err) {
        console.warn('API Fetch failed, using dummy data only');
        return DUMMY_EVENTS;
    }
};

export const fetchEventById = async (id: string): Promise<Event | undefined> => {
    try {
        const response = await api.get(`/services/${id}`);
        if (!response.data) {
            return DUMMY_EVENTS.find(e => e.id === id);
        }
        return mapServiceToEvent(response.data);
    } catch (e) {
        return DUMMY_EVENTS.find(e => e.id === id);
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
