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
  getUserBookings: async () => {
    return api.get<Booking[]>('/bookings/mine');
  },
  
  getVendorBookings: async () => {
    return api.get<Booking[]>('/bookings/vendor');
  },
  
  create: async (data: Partial<Booking>) => {
    return api.post<Booking>('/bookings', data);
  },
  
  updateStatus: async (id: string, status: Booking['status']) => {
    return api.patch<Booking>(`/bookings/${id}/status`, { status });
  },
  
  getStats: async () => {
    return api.get<any>('/bookings/vendor/earnings');
  },
  
  getEarnings: async () => {
    return api.get<any>('/bookings/vendor/earnings');
  }
};
