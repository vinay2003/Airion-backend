import { api } from '../apiClient';

export interface Review {
  id: string;
  userId: string;
  vendorId: string;
  listingId: string;
  userName: string;
  rating: number;
  comment: string;
  replyText?: string;
  createdAt: string;
}

export const reviewService = {
  getVendorReviews: async (vendorId: string, params?: any) => {
    return api.get<Review[]>(`/vendors/${vendorId}/reviews`, { params });
  },
  
  create: async (data: Partial<Review>) => {
    return api.post<Review>('/reviews', data);
  },
  
  reply: async (id: string, replyText: string) => {
    return api.patch<Review>(`/reviews/${id}/reply`, { replyText });
  },
  
  getStats: async (vendorId: string) => {
    return api.get<any>(`/vendors/${vendorId}/stats/reviews`);
  }
};
