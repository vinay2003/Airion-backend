import { api } from '../apiClient';

export interface Booking {
  id: string;
  userId: string;
  vendorId: string;
  listingId: string;
  listingName: string;
  userName: string;
  vendorName: string;
  eventDate: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export const bookingService = {
  getUserBookings: async (userId: string) => {
    return api.get<Booking[]>(`/users/${userId}/bookings`);
  },
  
  getVendorBookings: async (vendorId: string) => {
    return api.get<Booking[]>(`/vendors/${vendorId}/bookings`);
  },
  
  create: async (data: Partial<Booking>) => {
    return api.post<Booking>('/bookings', data);
  },
  
  updateStatus: async (id: string, status: Booking['status']) => {
    return api.patch<Booking>(`/bookings/${id}/status`, { status });
  },
  
  getStats: async (vendorId: string) => {
    return api.get<any>(`/vendors/${vendorId}/stats/bookings`);
  }
};
