import { api } from '../apiClient';

export interface Listing {
  id: string;
  vendorId: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  images: string[];
  location: string;
  rating: number;
  reviewsCount: number;
  capacity?: number;
  status: 'active' | 'inactive';
}

export const listingService = {
  getAll: async (params?: any) => {
    return api.get<Listing[]>('/listings', { params });
  },
  
  getById: async (id: string) => {
    return api.get<Listing>(`/listings/${id}`);
  },
  
  getByVendor: async (vendorId: string) => {
    return api.get<Listing[]>(`/vendors/${vendorId}/listings`);
  },
  
  create: async (data: Partial<Listing>) => {
    return api.post<Listing>('/listings', data);
  },
  
  update: async (id: string, data: Partial<Listing>) => {
    return api.patch<Listing>(`/listings/${id}`, data);
  },
  
  remove: async (id: string) => {
    return api.delete<void>(`/listings/${id}`);
  },
};
