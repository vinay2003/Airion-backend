import type { Event } from '../types';
import axios from 'axios';

// Mock Data
const MOCK_EVENTS: Event[] = [
    // Weddings (4)
    { id: '1', vendorId: '1a0083b6-10a0-45c8-b4b2-42f12f5c0c40', title: 'Grand Heritage Hotel', category: 'Weddings', images: ['https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000&auto=format&fit=crop'], image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80', rating: 4.8, location: 'Mumbai', reviews: 124, price: '₹50,000', capacity: '500-1000', description: 'Luxury hotel with grand ballroom and exquisite catering services.' },
    { id: '2', vendorId: '1a0083b6-10a0-45c8-b4b2-42f12f5c0c40', title: 'The Beachfront Resort', category: 'Weddings', images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000&auto=format&fit=crop', 'https://images.unsplash.com/photo-1582268611958-ebaf161562c2?q=80'], image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80', rating: 4.9, location: 'Goa', reviews: 89, price: '₹80,000', capacity: '200-500', description: 'Beautiful beachside resort perfect for destination weddings.' },
    { id: '3', vendorId: '1a0083b6-10a0-45c8-b4b2-42f12f5c0c40', title: 'Prestige Royal Gardens', category: 'Weddings', images: ['https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000&auto=format&fit=crop', 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80'], image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80', rating: 4.7, location: 'Delhi', reviews: 156, price: '₹1,50,000', capacity: '1000+', description: 'Lush open gardens with fully weather-proofed premium canopies.' },
    
    // Birthdays (2)
    { id: '5', vendorId: '1a0083b6-10a0-45c8-b4b2-42f12f5c0c40', title: 'Avenue Club House', category: 'Birthdays', images: ['https://images.unsplash.com/photo-1530103862676-de3c9a59af57?q=80&w=1000&auto=format&fit=crop', 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80'], image: 'https://images.unsplash.com/photo-1530103862676-de3c9a59af57?q=80', rating: 4.6, location: 'Bangalore', reviews: 78, price: '₹15,000', capacity: '50-150', description: 'Modern club with state-of-the-art sound system and lighting.' },
    { id: '6', vendorId: '1a0083b6-10a0-45c8-b4b2-42f12f5c0c40', title: 'Wonderland Theme Park Hall', category: 'Birthdays', image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=1000&auto=format&fit=crop', rating: 4.4, location: 'Noida', reviews: 45, price: '₹20,000', capacity: '50-100', description: 'Fun-filled zone equipped with balloon tracks and laser floors.' },

    // Corporate (2)
    { id: '9', vendorId: '1a0083b6-10a0-45c8-b4b2-42f12f5c0c40', title: 'Innovators Tech Hub', category: 'Corporate', images: ['https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1000&auto=format&fit=crop', 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80'], image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80', rating: 4.7, location: 'Bangalore', reviews: 95, price: '₹25,000', capacity: '50-100', description: 'Co-working space custom tailored for enterprise board meetings.' },
    { id: '11', vendorId: '1a0083b6-10a0-45c8-b4b2-42f12f5c0c40', title: 'Elite Executive Suites', category: 'Corporate', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop', rating: 4.6, location: 'Hyderabad', reviews: 82, price: '₹30,000', capacity: '20-50', description: 'Professional environment supporting workshops, webinars, and conferences.' },

    // Parties (1)
    { id: '7', vendorId: '1a0083b6-10a0-45c8-b4b2-42f12f5c0c40', title: 'Apex Rooftop Lounge', category: 'Parties', images: ['https://images.unsplash.com/photo-1570872626485-d8ffea69f463?q=80&w=1000&auto=format&fit=crop', 'https://images.unsplash.com/photo-1514525253440-b393452e3383?q=80'], image: 'https://images.unsplash.com/photo-1570872626485-d8ffea69f463?q=80', rating: 4.8, location: 'Mumbai', reviews: 112, price: '₹40,000', capacity: '100-200', description: 'Stunning rooftop view of the city skyline with fully integrated bar row.' },

    // Photography (1)
    { id: '13', vendorId: '1a0083b6-10a0-45c8-b4b2-42f12f5c0c40', title: 'Pixel Perfect Studios', category: 'Photography', image: 'https://images.unsplash.com/photo-1520390138845-ff2d1c34a31a?q=80&w=1000&auto=format&fit=crop', rating: 4.9, location: 'Mumbai', reviews: 231, price: '₹35,000', capacity: 'N/A', description: 'Master photographers capturing cinematic pre-wedding and post-event videos.' },

    // Catering (1)
    { id: '14', vendorId: '1a0083b6-10a0-45c8-b4b2-42f12f5c0c40', title: 'Royal Gourmet Kitchen', category: 'Catering', image: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1000&auto=format&fit=crop', rating: 4.8, location: 'Delhi', reviews: 198, price: '₹1,200/Plate', capacity: '100-5000', description: 'Unforgettable multidimensional culinary experiences for grand celebrations.' },

    // Decor (1)
    { id: '15', vendorId: '1a0083b6-10a0-45c8-b4b2-42f12f5c0c40', title: 'Floral Fantasy Decorators', category: 'Decor', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000&auto=format&fit=crop', rating: 4.7, location: 'Jaipur', reviews: 142, price: '₹25,000', capacity: 'N/A', description: 'Bespoke floral & light ornaments custom bound to your wedding pillars.' },

    // Music (1)
    { id: '16', vendorId: '1a0083b6-10a0-45c8-b4b2-42f12f5c0c40', title: 'Electro Beats DJ & Sound', category: 'Music', image: 'https://images.unsplash.com/photo-1470225620780-99128d2509e8?q=80&w=1000&auto=format&fit=crop', rating: 4.5, location: 'Pune', reviews: 76, price: '₹18,000', capacity: 'N/A', description: 'Concert grade audio equipment for keeping dancefloors fully operational.' },

    // Venues (1)
    { id: '17', vendorId: '1a0083b6-10a0-45c8-b4b2-42f12f5c0c40', title: 'Imperial Palace Estate', category: 'Venues', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop', rating: 4.9, location: 'Udaipur', reviews: 305, price: '₹2,50,000', capacity: '800+', description: 'Historical monument with massive corridors bounding lake views.' },

    // Makeup (1)
    { id: '18', vendorId: '1a0083b6-10a0-45c8-b4b2-42f12f5c0c40', title: 'Glow Up Bridal Vanity', category: 'Makeup', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1000&auto=format&fit=crop', rating: 4.8, location: 'Delhi', reviews: 167, price: '₹12,000', capacity: 'N/A', description: 'HD waterproof bridal makeup that holds beautifully under heavy studio flashes.' },

    // Planning (1)
    { id: '19', vendorId: '1a0083b6-10a0-45c8-b4b2-42f12f5c0c40', title: 'Signature Event planners', category: 'Planning', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop', rating: 4.8, location: 'Chennai', reviews: 92, price: '₹45,000', capacity: 'N/A', description: 'Turnkey coordinators managing catering, entryways, and schedule loops and queues.' }
];

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

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear token
            localStorage.removeItem('token');
        }
        return Promise.reject(error);
    }
);

export default api;

export const fetchEvents = async (): Promise<Event[]> => {
    // Simulate API delay
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_EVENTS);
        }, 500);
    });
};

export const fetchEventById = async (id: string): Promise<Event | undefined> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_EVENTS.find(e => e.id.toString() === id));
        }, 300);
    });
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

