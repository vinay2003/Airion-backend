import { create } from 'zustand';
import { listingService, Listing } from '../services/listingService';

interface ListingStore {
  listings: Listing[];
  listing: Listing | null;
  loading: boolean;
  error: string | null;
  
  fetchListings: (params?: any) => Promise<void>;
  fetchVendorListings: (vendorId: string) => Promise<void>;
  fetchListing: (id: string) => Promise<void>;
  createListing: (data: Partial<Listing>) => Promise<void>;
  updateListing: (id: string, data: Partial<Listing>) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
}

export const useListingStore = create<ListingStore>((set, get) => ({
  listings: [],
  listing: null,
  loading: false,
  error: null,
  
  fetchListings: async (params) => {
    set({ loading: true, error: null });
    try {
      const data = await listingService.getAll(params);
      set({ listings: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch listings', loading: false });
    }
  },
  
  fetchVendorListings: async (vendorId) => {
    set({ loading: true, error: null });
    try {
      const data = await listingService.getByVendor(vendorId);
      set({ listings: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch vendor listings', loading: false });
    }
  },
  
  fetchListing: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await listingService.getById(id);
      set({ listing: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch listing', loading: false });
    }
  },
  
  createListing: async (data) => {
    set({ loading: true, error: null });
    try {
      const newListing = await listingService.create(data);
      set((state) => ({ 
        listings: [newListing, ...state.listings],
        loading: false 
      }));
    } catch (err: any) {
      set({ error: err.message || 'Failed to create listing', loading: false });
      throw err;
    }
  },
  
  updateListing: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const updated = await listingService.update(id, data);
      set((state) => ({ 
        listings: state.listings.map(l => l.id === id ? updated : l),
        listing: state.listing?.id === id ? updated : state.listing,
        loading: false 
      }));
    } catch (err: any) {
      set({ error: err.message || 'Failed to update listing', loading: false });
      throw err;
    }
  },
  
  deleteListing: async (id) => {
    set({ loading: true, error: null });
    try {
      await listingService.remove(id);
      set((state) => ({ 
        listings: state.listings.filter(l => l.id !== id),
        loading: false 
      }));
    } catch (err: any) {
      set({ error: err.message || 'Failed to delete listing', loading: false });
      throw err;
    }
  }
}));
