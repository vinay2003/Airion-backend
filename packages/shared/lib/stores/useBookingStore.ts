import { create } from 'zustand';
import { bookingService, Booking } from '../services/bookingService';

interface BookingStore {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  stats: any | null;
  
  fetchUserBookings: (userId: string) => Promise<void>;
  fetchVendorBookings: (vendorId: string) => Promise<void>;
  updateBookingStatus: (id: string, status: Booking['status']) => Promise<void>;
  fetchBookingStats: (vendorId: string) => Promise<void>;
}

export const useBookingStore = create<BookingStore>((set, get) => ({
  bookings: [],
  loading: false,
  error: null,
  stats: null,
  
  fetchUserBookings: async (userId) => {
    set({ loading: true, error: null });
    try {
      const data = await bookingService.getUserBookings(userId);
      set({ bookings: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch user bookings', loading: false });
    }
  },
  
  fetchVendorBookings: async (vendorId) => {
    set({ loading: true, error: null });
    try {
      const data = await bookingService.getVendorBookings(vendorId);
      set({ bookings: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch vendor bookings', loading: false });
    }
  },
  
  updateBookingStatus: async (id, status) => {
    set({ loading: true, error: null });
    try {
      const updated = await bookingService.updateStatus(id, status);
      set((state) => ({ 
        bookings: state.bookings.map(b => b.id === id ? updated : b),
        loading: false 
      }));
    } catch (err: any) {
      set({ error: err.message || 'Failed to update booking status', loading: false });
      throw err;
    }
  },
  
  fetchBookingStats: async (vendorId) => {
    try {
       const data = await bookingService.getStats(vendorId);
       set({ stats: data });
    } catch (err) {
       console.error('Failed to fetch stats', err);
    }
  }
}));
