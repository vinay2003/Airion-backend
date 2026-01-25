import type { Event } from '../types';

// Mock Data
const MOCK_EVENTS: Event[] = [
    { id: '1', title: 'Grand Hotel', category: 'Weddings', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop', rating: 4.8, location: 'Mumbai', reviews: 124, price: '₹50,000', capacity: '500-1000', description: 'Luxury hotel with grand ballroom and exquisite catering services.' },
    { id: '2', title: 'Sunset Resort', category: 'Weddings', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000&auto=format&fit=crop', rating: 4.9, location: 'Goa', reviews: 89, price: '₹80,000', capacity: '200-500', description: 'Beautiful beachside resort perfect for destination weddings.' },
    { id: '3', title: 'City Hall', category: 'Weddings', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1000&auto=format&fit=crop', rating: 4.5, location: 'Delhi', reviews: 210, price: '₹30,000', capacity: '100-300', description: 'Historic venue in the heart of the city with classic architecture.' },
    { id: '4', title: 'Royal Palace', category: 'Weddings', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop', rating: 4.7, location: 'Jaipur', reviews: 156, price: '₹1,50,000', capacity: '500+', description: 'Experience royalty with this magnificent palace venue.' },
    { id: '5', title: 'Club House', category: 'Parties', image: 'https://images.unsplash.com/photo-1530103862676-de3c9a59af57?q=80&w=1000&auto=format&fit=crop', rating: 4.6, location: 'Bangalore', reviews: 78, price: '₹15,000', capacity: '50-150', description: 'Modern club with state-of-the-art sound system and lighting.' },
    { id: '6', title: 'Beach Bar', category: 'Parties', image: 'https://images.unsplash.com/photo-1514525253440-b393452e3383?q=80&w=1000&auto=format&fit=crop', rating: 4.4, location: 'Goa', reviews: 45, price: '₹20,000', capacity: '50-100', description: 'Chill beach bar atmosphere for relaxed parties and gatherings.' },
    { id: '7', title: 'Rooftop Lounge', category: 'Parties', image: 'https://images.unsplash.com/photo-1570872626485-d8ffea69f463?q=80&w=1000&auto=format&fit=crop', rating: 4.8, location: 'Mumbai', reviews: 112, price: '₹40,000', capacity: '100-200', description: 'Stunning rooftop view of the city skyline.' },
    { id: '8', title: 'Garden Party', category: 'Parties', image: 'https://images.unsplash.com/photo-1519671482538-518b5c2c6c1c?q=80&w=1000&auto=format&fit=crop', rating: 4.5, location: 'Pune', reviews: 67, price: '₹25,000', capacity: '100-300', description: 'Lush green garden perfect for outdoor parties.' },
    { id: '9', title: 'Tech Hub', category: 'Meetups', image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1000&auto=format&fit=crop', rating: 4.7, location: 'Bangalore', reviews: 95, price: '₹10,000', capacity: '50-100', description: 'Modern co-working space equipped for tech meetups.' },
    { id: '10', title: 'Community Center', category: 'Meetups', image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1000&auto=format&fit=crop', rating: 4.3, location: 'Delhi', reviews: 54, price: '₹5,000', capacity: '50-200', description: 'Affordable community hall for local gatherings.' },
    { id: '11', title: 'Co-working Space', category: 'Meetups', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop', rating: 4.6, location: 'Hyderabad', reviews: 82, price: '₹8,000', capacity: '20-50', description: 'Professional environment for workshops and seminars.' },
    { id: '12', title: 'Library Hall', category: 'Meetups', image: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?q=80&w=1000&auto=format&fit=crop', rating: 4.5, location: 'Chennai', reviews: 41, price: '₹6,000', capacity: '30-80', description: 'Quiet and spacious hall suitable for reading clubs and discussions.' },
];

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
