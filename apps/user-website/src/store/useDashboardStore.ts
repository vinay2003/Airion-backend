import { create } from 'zustand';

export interface BudgetItem {
    id: string;
    category: string;
    allocated: number;
    spent: number;
    vendorId?: string;
    vendorName?: string;
    status: 'paid' | 'pending' | 'over-budget';
}

export interface Booking {
    id: string;
    vendorName: string;
    category: string;
    date: string;
    time: string;
    status: 'Upcoming' | 'Pending' | 'Completed' | 'Cancelled';
    price: number;
    paidAmount: number;
    imageUrl: string;
    location: string;
    emiAvailable: boolean;
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'booking' | 'offer' | 'chat' | 'reminder';
    date: string;
    read: boolean;
}

export interface Message {
    id: string;
    sender: 'user' | 'vendor';
    text: string;
    timestamp: string;
}

export interface ChatThread {
    id: string;
    vendorName: string;
    vendorAvatar: string;
    lastMessage: string;
    timestamp: string;
    unread: boolean;
    messages: Message[];
}

interface DashboardState {
    // Budget
    totalBudget: number;
    budgetItems: BudgetItem[];
    
    // Bookings
    bookings: Booking[];
    
    // Notifications & Chats
    notifications: Notification[];
    chatThreads: ChatThread[];
    
    // Actions
    updateBudgetAllocation: (id: string, allocated: number) => void;
    addExpense: (id: string, amount: number) => void;
    markNotificationRead: (id: string) => void;
    markAllRead: () => void;
    sendMessage: (threadId: string, text: string) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
    // Mock Data for Budget
    totalBudget: 500000, // ₹5,00,000
    budgetItems: [
        { id: '1', category: 'Venue', allocated: 200000, spent: 180000, vendorName: 'Grand Hyatt', status: 'paid' },
        { id: '2', category: 'Catering', allocated: 150000, spent: 45000, vendorName: 'Flavor Delight', status: 'pending' },
        { id: '3', category: 'Photography', allocated: 80000, spent: 85000, vendorName: 'Pixel Perfect', status: 'over-budget' },
        { id: '4', category: 'Decoration', allocated: 50000, spent: 0, status: 'pending' },
        { id: '5', category: 'Music / DJ', allocated: 20000, spent: 10000, vendorName: 'DJ Rock', status: 'paid' }
    ],

    // Mock Bookings
    bookings: [
        {
            id: 'B001',
            vendorName: 'Grand Hyatt Venue',
            category: 'Venue',
            date: '2026-05-15',
            time: '18:00',
            status: 'Upcoming',
            price: 180000,
            paidAmount: 180000,
            imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=400&q=80',
            location: 'Mumbai, MH',
            emiAvailable: true
        },
        {
            id: 'B002',
            vendorName: 'Pixel Perfect Photography',
            category: 'Photography',
            date: '2026-05-15',
            time: '10:00',
            status: 'Pending',
            price: 85000,
            paidAmount: 25000,
            imageUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=400&q=80',
            location: 'Mumbai, MH',
            emiAvailable: false
        },
        {
            id: 'B003',
            vendorName: 'Flavor Delight Caterers',
            category: 'Catering',
            date: '2026-05-15',
            time: '19:30',
            status: 'Upcoming',
            price: 150000,
            paidAmount: 45000,
            imageUrl: 'https://images.unsplash.com/photo-1555244166-3f8b320cd56b?auto=format&fit=crop&w=400&q=80',
            location: 'Mumbai, MH',
            emiAvailable: true
        }
    ],

    // Mock Notifications
    notifications: [
        { id: 'n1', title: 'Payment Success', message: 'You payment of ₹25,000 to Pixel Perfect is complete.', type: 'booking', date: '2 hours ago', read: false },
        { id: 'n2', title: 'New Message', message: 'Grand Hyatt: "We details of your lighting request is ready."', type: 'chat', date: '1 day ago', read: false },
        { id: 'n3', title: 'Discount Code', message: 'Get 20% off on Decoration packages today!', type: 'offer', date: '5 hours ago', read: true }
    ],

    // Mock Chats
    chatThreads: [
        {
            id: 'c1',
            vendorName: 'Grand Hyatt',
            vendorAvatar: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=100&q=80',
            lastMessage: 'The details of your lighting request is ready.',
            timestamp: '15:30',
            unread: true,
            messages: [
                { id: 'm1', sender: 'user', text: 'Hi, do you allow outside decorators?', timestamp: '14:00' },
                { id: 'm2', sender: 'vendor', text: 'Yes we do, subject to a royalty fee.', timestamp: '14:15' },
                { id: 'm3', sender: 'vendor', text: 'The details of your lighting request is ready.', timestamp: '15:30' }
            ]
        },
        {
            id: 'c2',
            vendorName: 'Pixel Perfect',
            vendorAvatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=100&q=80',
            lastMessage: 'Looking forward to the event!',
            timestamp: 'Yesterday',
            unread: false,
            messages: [
                { id: 'm4', sender: 'user', text: 'Can we schedule a pre-shoot?', timestamp: 'Yesterday' },
                { id: 'm5', sender: 'vendor', text: 'Absolutely! Looking forward to the event!', timestamp: 'Yesterday' }
            ]
        }
    ],

    updateBudgetAllocation: (id, allocated) => set((state) => ({
        budgetItems: state.budgetItems.map(item => item.id === id ? { ...item, allocated } : item)
    })),

    addExpense: (id, amount) => set((state) => ({
        budgetItems: state.budgetItems.map(item => item.id === id ? { ...item, spent: item.spent + amount } : item)
    })),

    markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    })),

    markAllRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true }))
    })),

    sendMessage: (threadId, text) => set((state) => ({
        chatThreads: state.chatThreads.map(thread => 
            thread.id === threadId 
                ? {
                    ...thread, 
                    messages: [...thread.messages, { id: `m${Date.now()}`, sender: 'user', text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }],
                    lastMessage: text,
                    timestamp: 'Just now'
                  }
                : thread
        )
    }))
}));
