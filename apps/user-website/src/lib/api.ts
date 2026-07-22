import type { Event } from '../types';
import axios from 'axios';

const mapServiceToEvent = (service: any): Event => {
    return {
        id: service.id,
        vendorId: service.vendorId,
        title: service.title,
        category: service.category?.name || 'Uncategorized',
        image: service.images?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200',
        images: service.images || [],
        rating: service.vendor?.rating || 4.5,
        location: service.availableLocations?.[0] || 'Mumbai',
        reviews: service.vendor?.totalReviews || 0,
        price: `${service.currency || 'INR'} ${parseFloat(service.basePrice).toLocaleString()}`,
        capacity: 'Contact Vendor',
        description: service.description || '',
        vendorName: service.vendor?.businessName || 'Ease2Event Partner',
        vendorImage: service.vendor?.portfolioImages?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=200',
        packages: service.packages && service.packages.length
            ? service.packages.map((pkg: any) => ({
                title: pkg.name || pkg.title || '',
                price: typeof pkg.price === 'number'
                    ? `₹${pkg.price.toLocaleString()}`
                    : (pkg.price ? (String(pkg.price).startsWith('₹') ? pkg.price : `₹${pkg.price}`) : 'Contact Vendor'),
                desc: pkg.description || pkg.desc || '',
                features: pkg.features || [],
            }))
            : undefined,
    };
};

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: { 'Content-Type': 'application/json' },
});

// Auth Interceptor: Inject token from localStorage
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('ease2event_token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    // Debug logging for easier troubleshooting
    if (import.meta.env.DEV) {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
}, (error) => Promise.reject(error));

// Response Interceptor: Handle 401 Unauthorized & Unwrap Success Wraps
api.interceptors.response.use(
    (response) => {
        // If the backend wrapped the result in { success: true, data: ... }, unwrap it for the callers
        if (response.data && response.data.success === true && response.data.data !== undefined) {
            return response.data.data;
        }
        return response.data;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('ease2event_token');
        }
        return Promise.reject(error);
    }
);

export default api;

export const fetchEvents = async (filters: Record<string, any> = {}): Promise<Event[]> => {
    // 🎭 Robust & Premium Mock Repository (12 Items) - UPGRADED TO HD IMAGES
    const mockServices = [
        // WEDDINGS
        { id: 'w-1', title: 'The Royal Grand Palace', category: 'Weddings', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2000&auto=format&fit=crop', rating: 4.9, location: 'Rajasthan', reviews: 156, price: '₹3,50,000', description: 'Experience royal luxury in a heritage palace setting. Perfect for grand destination weddings.', amenities: ['Parking', 'AC', 'Catering', 'Stage', 'Decor', 'Wifi', 'Bar', 'Pool'], capacity: '500+ guests' },
        { id: 'w-2', title: 'Emerald Garden Estate', category: 'Weddings', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop', rating: 4.8, location: 'South Delhi', reviews: 210, price: '₹4,20,000', description: 'A lush green oasis for a magical garden wedding.', amenities: ['Parking', 'Catering', 'Bar', 'Pool', 'Wifi', 'AC', 'Decor'], capacity: '300 guests' },
        { id: 'w-3', title: 'Sunset Beach Resort', category: 'Weddings', image: 'https://images.unsplash.com/photo-1515232389446-a17ce9ca7434?q=80&w=2000&auto=format&fit=crop', rating: 4.7, location: 'Goa', reviews: 89, price: '₹2,80,000', description: 'Intimate beach wedding venue with stunning Arabian Sea views.', amenities: ['Wifi', 'AC', 'Pool', 'Bar', 'Parking', 'Catering'], capacity: '150 guests' },
        { id: 'w-4', title: 'Crystal Ballroom Luxe', category: 'Weddings', image: 'https://images.unsplash.com/photo-1707374661682-d804856cee22?q=80&w=2000&auto=format&fit=crop', rating: 4.6, location: 'Mumbai', reviews: 145, price: '₹1,50,000', description: 'Ultra-modern ballroom for high-profile weddings in Mumbai.', amenities: ['Wifi', 'Parking', 'AC', 'Stage', 'Catering', 'Decor', 'Bar'], capacity: '200 guests' },

        // PARTIES
        { id: 'p-1', title: 'Neon Sky Lounge', category: 'Parties', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2000&auto=format&fit=crop', rating: 4.5, location: 'Bangalore', reviews: 320, price: '₹65,000', description: 'Vibrant rooftop lounge for birthdays and high-energy music nights.', amenities: ['Wifi', 'AC', 'Bar', 'Stage', 'Decor', 'Parking', 'Catering'], capacity: '100 guests' },
        { id: 'p-2', title: 'Aqua Poolside Deck', category: 'Parties', image: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=2000&auto=format&fit=crop', rating: 4.4, location: 'Mumbai', reviews: 178, price: '₹95,000', description: 'Floating bar and DJ setup for ultimate poolside summer vibes.', amenities: ['Parking', 'Pool', 'Bar', 'Wifi', 'Decor', 'AC', 'Catering'], capacity: '80 guests' },
        { id: 'p-3', title: 'Rustic Wine Loft', category: 'Parties', image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2000&auto=format&fit=crop', rating: 4.8, location: 'Pune', reviews: 64, price: '₹45,000', description: 'Charming rustic loft for intimate gatherings and private celebrations.', amenities: ['Wifi', 'Catering', 'Decor', 'AC'], capacity: '40 guests' },
        { id: 'p-4', title: 'The Retro Club Hub', category: 'Parties', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2000&auto=format&fit=crop', rating: 4.6, location: 'Kolkata', reviews: 240, price: '₹75,000', description: 'Vintage-themed club for themed parties and nostalgic celebrations.', amenities: ['AC', 'Bar', 'Stage', 'Parking', 'Decor'], capacity: '120 guests' },

        // CORPORATE
        { id: 'c-1', title: 'Zenith Business Center', category: 'Corporate', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2000&auto=format&fit=crop', rating: 4.9, location: 'Gurgaon', reviews: 412, price: '₹1,50,000', description: 'Equipped with fiber-optic Wi-Fi and 4K projectors for international seminars.', amenities: ['Wifi', 'AC', 'Parking', 'Stage', 'Catering', 'Decor'], capacity: '250 guests' },
        { id: 'c-2', title: 'The Boardroom Oasis', category: 'Corporate', image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=2000&auto=format&fit=crop', rating: 4.7, location: 'Hyderabad', reviews: 134, price: '₹40,000', description: 'Professional environment for high-stakes board meetings.', amenities: ['Wifi', 'AC', 'Catering'], capacity: '20 guests' },
        { id: 'c-3', title: 'Innovation Nexus Hall', category: 'Corporate', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop', rating: 4.8, location: 'Bangalore', reviews: 92, price: '₹2,20,000', description: 'Modern auditorium designed for product launches and tech conferences.', amenities: ['Wifi', 'AC', 'Parking', 'Stage'], capacity: '400 guests' },
        { id: 'c-4', title: 'Crystal Summit Suite', category: 'Corporate', image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNvcnBvcmF0ZSUyMGV2ZW50fGVufDB8fDB8fHww', rating: 4.5, location: 'Kolkata', reviews: 55, price: '₹1,10,000', description: 'Sleek, minimalist space ideal for networking events and workshops.', amenities: ['Wifi', 'AC', 'Catering', 'Decor'], capacity: '60 guests' },

        // BIRTHDAY
        { id: 'b-1', title: 'Candy Sky Party Zone', category: 'Birthday', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=2000&auto=format&fit=crop', rating: 4.7, location: 'Mumbai', reviews: 198, price: '₹35,000', description: 'Fun-filled birthday venue with themed decor packages for all ages.', amenities: ['Wifi', 'Parking', 'Decor', 'Catering', 'AC', 'Stage'], capacity: '50 guests' },
        { id: 'b-2', title: 'Rainbow Fiesta Hall', category: 'Birthday', image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=2000&auto=format&fit=crop', rating: 4.5, location: 'Pune', reviews: 142, price: '₹25,000', description: 'Vibrant, colorful space perfect for kids and family birthday parties.', amenities: ['Parking', 'Decor', 'Catering', 'Wifi', 'AC'], capacity: '30 guests' },

        // ENGAGEMENT
        { id: 'e-1', title: 'Rose Garden Pavilion', category: 'Engagement', image: 'https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?q=80&w=2000&auto=format&fit=crop', rating: 4.9, location: 'Jaipur', reviews: 87, price: '₹1,20,000', description: 'Romantic garden pavilion adorned with roses — the perfect engagement setting.', amenities: ['Parking', 'Decor', 'Catering', 'AC', 'Wifi'], capacity: '100 guests' },
        { id: 'e-2', title: 'The Golden Terrace', category: 'Engagement', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2000&auto=format&fit=crop', rating: 4.8, location: 'Delhi', reviews: 74, price: '₹85,000', description: 'Elegant rooftop terrace with city lights backdrop for intimate engagements.', amenities: ['Bar', 'Wifi', 'Decor', 'Catering', 'AC'], capacity: '50 guests' },

        // PRIVATE PARTY
        { id: 'pp-1', title: 'The Secret Garden Club', category: 'Private Party', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2000&auto=format&fit=crop', rating: 4.6, location: 'Goa', reviews: 165, price: '₹55,000', description: 'Exclusive private venue for bachelorette parties and personal milestones.', amenities: ['Wifi', 'Bar', 'Pool', 'Decor', 'Catering', 'AC'], capacity: '30 guests' },
        { id: 'pp-2', title: 'VIP Skyline Lounge', category: 'Private Party', image: 'https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=2000&auto=format&fit=crop', rating: 4.7, location: 'Chennai', reviews: 93, price: '₹70,000', description: 'Ultra-private skyline lounge for exclusive gatherings.', amenities: ['Wifi', 'AC', 'Bar', 'Parking', 'Catering', 'Decor'], capacity: '25 guests' }
    ];


    // Priority: Fetch Real Vendor Services from Backend
    let realEvents: Event[] = [];
    try {
        const params = new URLSearchParams();
        if (filters.category && filters.category.toLowerCase() !== 'all') {
            params.append('category', filters.category);
        }
        const query = params.toString();
        const url = `/services${query ? `?${query}` : ''}`;
        
        const response = await api.get(url);
        const data = response.data?.data || response.data || [];
        if (Array.isArray(data)) {
            realEvents = data.map(mapServiceToEvent);
        }
    } catch (err) {
        console.error('Failed to fetch real vendor services:', err);
    }

    // Combine real events with mocks for development quality assurance
    let mockResults = [...mockServices];

    if (filters.category && filters.category.toLowerCase() !== 'all') {
        const cat = filters.category.toLowerCase();
        mockResults = mockResults.filter(s => s.category.toLowerCase().includes(cat) || cat.includes(s.category.toLowerCase()));
    }

    const mappedMocks = mockResults.map((s, idx) => ({
        ...s,
        images: (s as any).images || [],
        vendorId: '550e8400-e29b-41d4-a716-446655440000',
        vendorName: 'The Royal Grand Palace',
        vendorImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=200',
        reviews: s.reviews || 0,
        capacity: (s as any).capacity || 'Contact Vendor',
        isSponsored: idx % 3 === 0 
    })) as Event[];

    // Return real events first, then mocks
    return [...realEvents, ...mappedMocks];
};

export const fetchVendorDiscovery = async (filters: Record<string, any> = {}): Promise<Event[]> => {
    let realVendors: Event[] = [];
    try {
        const params = new URLSearchParams();
        if (filters.city) params.append('city', filters.city);
        if (filters.search) params.append('search', filters.search);
        
        // Convert to query string
        const query = params.toString();
        const url = `/vendors/discovery${query ? `?${query}` : ''}`;
        
        const response = await api.get(url);
        const data = response.data?.data?.vendors || response.data?.vendors || response.data || [];
        if (Array.isArray(data)) {
            realVendors = data.map((v: any) => ({
                id: v.id,
                vendorId: v.id,
                title: v.businessName || 'Unnamed Vendor',
                category: v.category?.name || v.category || 'Uncategorized',
                image: v.portfolioImages?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200',
                images: v.portfolioImages || [],
                rating: v.rating || 4.5,
                location: v.businessAddress?.city || 'India',
                reviews: v.totalReviews || 0,
                price: 'Contact for Pricing',
                capacity: 'Contact Vendor',
                description: v.bio || '',
                vendorName: v.businessName || 'Unnamed Vendor',
                vendorImage: v.portfolioImages?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=200',
                isSponsored: !!v.isSponsored,
                isFeatured: !!v.isFeatured
            }));
        }
    } catch (err) {
        console.error('Failed to fetch real vendors:', err);
    }

    const mockVendors = [
        // WEDDINGS
        { id: 'w-1', title: 'The Royal Grand Palace', category: 'Weddings', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2000&auto=format&fit=crop', rating: 4.9, location: 'Rajasthan', reviews: 156, price: '₹3,50,000', description: 'Experience royal luxury in a heritage palace setting. Perfect for grand destination weddings.', capacity: '500+ guests', vendorName: 'The Royal Grand Palace', vendorImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=200', isSponsored: true },
        { id: 'w-2', title: 'Emerald Garden Estate', category: 'Weddings', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop', rating: 4.8, location: 'South Delhi', reviews: 210, price: '₹4,20,000', description: 'A lush green oasis for a magical garden wedding.', capacity: '300 guests', vendorName: 'Emerald Garden Estate', vendorImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=200', isSponsored: false },
        { id: 'w-3', title: 'Sunset Beach Resort', category: 'Weddings', image: 'https://images.unsplash.com/photo-1515232389446-a17ce9ca7434?q=80&w=2000&auto=format&fit=crop', rating: 4.7, location: 'Goa', reviews: 89, price: '₹2,80,000', description: 'Intimate beach wedding venue with stunning Arabian Sea views.', capacity: '150 guests', vendorName: 'Sunset Beach Resort', vendorImage: 'https://images.unsplash.com/photo-1515232389446-a17ce9ca7434?q=80&w=200', isSponsored: false },
        { id: 'w-4', title: 'Crystal Ballroom Luxe', category: 'Weddings', image: 'https://images.unsplash.com/photo-1707374661682-d804856cee22?q=80&w=2000&auto=format&fit=crop', rating: 4.6, location: 'Mumbai', reviews: 145, price: '₹1,50,000', description: 'Ultra-modern ballroom for high-profile weddings in Mumbai.', capacity: '200 guests', vendorName: 'Crystal Ballroom Luxe', vendorImage: 'https://images.unsplash.com/photo-1707374661682-d804856cee22?q=80&w=200', isSponsored: false },
        
        // PARTIES
        { id: 'p-1', title: 'Neon Sky Lounge', category: 'Parties', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2000&auto=format&fit=crop', rating: 4.5, location: 'Bangalore', reviews: 320, price: '₹65,000', description: 'Vibrant rooftop lounge for birthdays and high-energy music nights.', capacity: '100 guests', vendorName: 'Neon Sky Lounge', vendorImage: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=200', isSponsored: true },
        { id: 'p-2', title: 'Aqua Poolside Deck', category: 'Parties', image: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=2000&auto=format&fit=crop', rating: 4.4, location: 'Mumbai', reviews: 178, price: '₹95,000', description: 'Floating bar and DJ setup for ultimate poolside summer vibes.', capacity: '80 guests', vendorName: 'Aqua Poolside Deck', vendorImage: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=200', isSponsored: false },
        
        // CORPORATE
        { id: 'c-1', title: 'Zenith Business Center', category: 'Corporate', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2000&auto=format&fit=crop', rating: 4.9, location: 'Gurgaon', reviews: 412, price: '₹1,50,000', description: 'Equipped with fiber-optic Wi-Fi and 4K projectors for international seminars.', capacity: '250 guests', vendorName: 'Zenith Business Center', vendorImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=200', isSponsored: false },
        { id: 'c-2', title: 'The Boardroom Oasis', category: 'Corporate', image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=2000&auto=format&fit=crop', rating: 4.7, location: 'Hyderabad', reviews: 134, price: '₹40,000', description: 'Professional environment for high-stakes board meetings.', capacity: '20 guests', vendorName: 'The Boardroom Oasis', vendorImage: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=200', isSponsored: false },
        
        // BIRTHDAYS
        { id: 'b-1', title: 'Candy Sky Party Zone', category: 'Birthday', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=2000&auto=format&fit=crop', rating: 4.7, location: 'Mumbai', reviews: 198, price: '₹35,000', description: 'Fun-filled birthday venue with themed decor packages for all ages.', capacity: '50 guests', vendorName: 'Candy Sky Party Zone', vendorImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=200', isSponsored: false }
    ];

    let combined = [...realVendors];
    if (combined.length === 0) {
        combined = mockVendors.map((v, idx) => ({
            ...v,
            vendorId: v.id,
            images: [v.image],
            isSponsored: v.isSponsored,
            isFeatured: idx % 2 === 0
        })) as any;
    }

    return combined;
};

export const fetchEventById = async (id: string): Promise<Event | undefined> => {
    const all = await fetchEvents();
    return all.find(e => e.id === id);
};

export const createBooking = async (data: any) => {
    const res = await api.post('/bookings', data);
    return res;
};

export const fetchMyBookings = async () => {
    const getMockBookings = () => [
        {
            id: 'mock-b-1',
            totalAmount: 350000,
            status: 'confirmed',
            paymentStatus: 'paid',
            bookingDate: '2026-10-24',
            createdAt: new Date().toISOString(),
            vendor: {
                businessName: 'The Royal Grand Palace',
                city: 'Rajasthan',
                portfolioImages: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400']
            }
        },
        {
            id: 'mock-b-2',
            totalAmount: 35000,
            status: 'pending',
            paymentStatus: 'pending',
            bookingDate: '2026-11-15',
            createdAt: new Date().toISOString(),
            vendor: {
                businessName: 'Pixel Perfect Photography',
                city: 'Delhi',
                portfolioImages: ['https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=400']
            }
        }
    ];

    try {
        const res = await api.get('/bookings/mine');
        const bookings = Array.isArray(res) ? res : [];
        if (bookings.length === 0) {
            return getMockBookings();
        }
        return bookings;
    } catch (err) {
        console.warn('Failed to fetch bookings, falling back to mock:', err);
        return getMockBookings();
    }
};

export const createPaymentOrder = async (amount: number, bookingId: string) => {
    return await api.post('/payments/create-order', { amount, bookingId });
};
export const verifyPayment = async (data: any, bookingId: string) => {
    return await api.post('/payments/verify', { ...data, bookingId });
};
export const toggleWishlist = async (vId: string) => await api.post(`/wishlists/toggle/${vId}`);

export const fetchMyWishlist = async () => {
    const getMockWishlist = () => [
        {
            id: 'w-1',
            vendor: {
                id: 'w-1',
                businessName: 'The Royal Grand Palace',
                city: 'Rajasthan',
                rating: 4.9,
                portfolioImages: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400']
            }
        },
        {
            id: 'p-1',
            vendor: {
                id: 'p-1',
                businessName: 'Neon Sky Lounge',
                city: 'Bangalore',
                rating: 4.5,
                portfolioImages: ['https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=400']
            }
        }
    ];

    try {
        const res = await api.get('/wishlists/mine');
        const items = Array.isArray(res) ? res : [];
        if (items.length === 0) {
            return getMockWishlist();
        }
        return items;
    } catch {
        return getMockWishlist();
    }
};

export const checkIsWishlisted = async (vId: string) => (await api.get(`/wishlists/check/${vId}`)) as any;
export const submitReview = async (data: { bookingId: string, rating: number, reviewText?: string }) => await api.post('/reviews', data);

export const fetchBudget = async () => {
    try {
        const res = await api.get('/budget');
        if (!res || !res.limit) {
            return { limit: 500000, spent: 385000, items: [] };
        }
        return res;
    } catch {
        return { limit: 500000, spent: 385000, items: [] };
    }
};
export const updateBudget = async (d: any) => await api.patch('/budget/update', d);
export const fetchGuests = async () => await api.get('/guests');
export const createGuest = async (d: any) => await api.post('/guests', d);
export const updateGuest = async (id: string, d: any) => await api.patch(`/guests/${id}`, d);
export const deleteGuest = async (id: string) => await api.delete(`/guests/${id}`);
export const fetchConversations = async () => (await api.get('/chat/conversations')) as any[];
export const fetchMessages = async (id: string) => (await api.get(`/chat/messages/${id}`)) as any[];
export const startConversation = async (vId: string) => await api.post('/chat/start', { participantId: vId });
export const updateProfile = async (d: any) => await api.patch('/auth/profile', d);
export const changePassword = async (d: any) => await api.post('/auth/change-password', d);
// --- VENDOR DASHBOARD & ANALYTICS (Step 6 Coordination) ---
export const fetchWalletOverview = async () => await api.get('/wallet/overview');
export const requestWithdrawal = async (amount: number, bankDetails?: any) => await api.post('/wallet/withdraw', { amount, bankDetails });
export const fetchVendorPerformance = async (vId: string, days: number = 7) => await api.get(`/analytics/vendor/${vId}/performance`, { params: { days } });
export const fetchVendorPerformanceDirect = async (vId: string, days: number = 7) => (await api.get(`/analytics/vendor/${vId}/performance`, { params: { days } }));
export const fetchVendorSchedule = async (vId: string) => await api.get(`/availability/vendor/${vId}`);
export const blockDate = async (date: string, reason?: string) => await api.post('/availability/block', { date, reason });
export const unblockDate = async (date: string) => await api.delete(`/availability/block/${date}`);
export const generateEasyReply = async (inquiry: string, voice?: string) => await api.post('/ai/easy-reply', { inquiry, voice });
export const checkAvailability = async (vId: string, date: string) => (await api.get('/availability/check', { params: { vendorId: vId, date } })) as any;
export const recordVendorProfileView = async (vId: string, guestVisitorId?: string) => await api.post(`/vendors/${vId}/profile-view`, { guestVisitorId });

export const uploadImage = async (file: File) => {
    const fd = new FormData(); fd.append('file', file);
    return (await api.post('/uploads/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } })) as any;
};

export const askSupportAI = async (message: string) => {
    return (await api.post('/ai/support', { message })) as any;
};

// --- Merchandise / Event Store API Endpoints ---
export const fetchProducts = async () => await api.get('/merchandise');
export const fetchProductById = async (id: string) => await api.get(`/merchandise/${id}`);
export const checkoutMerchandise = async (orderData: any) => await api.post('/merchandise/checkout', orderData);

