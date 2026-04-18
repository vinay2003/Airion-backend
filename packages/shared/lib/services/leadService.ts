import { api } from '../apiClient';

export interface Lead {
  id: string;
  userId: string;
  vendorId: string;
  serviceId?: string;
  eventDate: string;
  guestsCount?: number;
  budget?: number;
  notes?: string;
  status: string;
  aiScore: number;
  aiReasoning?: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    profileImage?: string;
  };
  service?: {
    id: string;
    title: string;
  };
}

export const leadService = {
  getVendorLeads: async () => {
    return api.get<Lead[]>('/leads/vendor');
  },
  
  getLeadDetails: async (id: string) => {
    return api.get<Lead>(`/leads/${id}`);
  },
  
  updateStatus: async (id: string, status: string) => {
    return api.patch<Lead>(`/leads/${id}/status`, { status });
  }
};
