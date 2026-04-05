import { api } from '../apiClient';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'USER' | 'VENDOR' | 'ADMIN';
  avatar?: string;
  createdAt: string;
}

export const userService = {
  getProfile: async () => {
    return api.get<User>('/users/me');
  },
  
  updateProfile: async (data: Partial<User>) => {
    return api.patch<User>('/users/me', data);
  },
  
  getAll: async (params?: any) => {
    return api.get<User[]>('/users', { params });
  }
};
