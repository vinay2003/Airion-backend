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
    };
};

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    headers: { 'Content-Type': 'application/json' },
});

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
        { id: 'c-4', title: 'Crystal Summit Suite', category: 'Corporate', image: 'https://images.unsplash.com/photo-1505373633519-2f54070733f2?q=80&w=2000&auto=format&fit=crop', rating: 4.5, location: 'Kolkata', reviews: 55, price: '₹1,10,000', description: 'Sleek, minimalist space ideal for networking events and workshops.', amenities: ['Wifi', 'AC', 'Catering', 'Decor'], capacity: '60 guests' },

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


    // Priority: Returning Mocks for development quality assurance
    let results = [...mockServices];

    if (filters.category && filters.category.toLowerCase() !== 'all') {
        const cat = filters.category.toLowerCase();
        results = results.filter(s => s.category.toLowerCase().includes(cat) || cat.includes(s.category.toLowerCase()));
    }

    return results.map(s => ({
        ...s,
        images: (s as any).images || [],
        vendorId: 'v-mock',
        reviews: s.reviews || 0,
        capacity: (s as any).capacity || 'Contact Vendor' // ✅ Added missing property
    })) as Event[];
};

export const fetchEventById = async (id: string): Promise<Event | undefined> => {
    const all = await fetchEvents();
    return all.find(e => e.id === id);
};

export const createBooking = async (data: any) => (await api.post('/bookings', data)).data;
export const fetchMyBookings = async () => {
    try { return (await api.get('/bookings/mine')).data; }
    catch { return [{ id: 'b1', eventDate: new Date().toISOString(), status: 'confirmed', listingName: 'Royal Palace' }]; }
};
export const createPaymentOrder = async (amount: number, bId: string) => (await api.post('/payments/create-order', { amount, bookingId: bId })).data;
export const verifyPayment = async (v: any, bId: string) => (await api.post('/payments/verify', { ...v, bookingId: bId })).data;
export const toggleWishlist = async (vId: string) => (await api.post(`/wishlists/toggle/${vId}`)).data;
export const fetchMyWishlist = async () => (await api.get('/wishlists/mine')).data;
export const fetchBudget = async () => (await api.get('/budget')).data;
export const updateBudget = async (d: any) => (await api.patch('/budget/update', d)).data;
export const fetchGuests = async () => (await api.get('/guests')).data;
export const createGuest = async (d: any) => (await api.post('/guests', d)).data;
export const updateGuest = async (id: string, d: any) => (await api.patch(`/guests/${id}`, d)).data;
export const deleteGuest = async (id: string) => (await api.delete(`/guests/${id}`)).data;
export const fetchConversations = async () => (await api.get('/chat/conversations')).data;
export const fetchMessages = async (id: string) => (await api.get(`/chat/messages/${id}`)).data;
export const startConversation = async (vId: string) => (await api.post('/chat/start', { vendorId: vId })).data;
export const updateProfile = async (d: any) => (await api.patch('/auth/profile', d)).data;
// --- VENDOR DASHBOARD & ANALYTICS (Step 6 Coordination) ---
export const fetchWalletOverview = async () => (await api.get('/wallet/overview')).data;
export const requestWithdrawal = async (amount: number, bankDetails?: any) => (await api.post('/wallet/withdraw', { amount, bankDetails })).data;
export const fetchVendorPerformance = async (vId: string, days: number = 7) => (await api.get(`/analytics/vendor/${vId}/performance`, { params: { days } })).data;
export const fetchVendorSchedule = async (vId: string) => (await api.get(`/availability/vendor/${vId}`)).data;
export const blockDate = async (date: string, reason?: string) => (await api.post('/availability/block', { date, reason })).data;
export const unblockDate = async (date: string) => (await api.delete(`/availability/block/${date}`)).data;
export const generateEasyReply = async (inquiry: string, voice?: string) => (await api.post('/ai/easy-reply', { inquiry, voice })).data;
export const checkAvailability = async (vId: string, date: string) => (await api.get('/availability/check', { params: { vendorId: vId, date } })).data;

export const uploadImage = async (file: File) => {
    const fd = new FormData(); fd.append('file', file);
    return (await api.post('/uploads/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } })).data;
};
