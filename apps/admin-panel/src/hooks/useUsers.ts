import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@ease2event/shared/auth/api';
import toast from 'react-hot-toast';

export const useAdminUsers = (page: number, limit: number, search: string, status: string, sort: string) => {
    return useQuery({
        queryKey: ['adminUsers', { page, limit, search, status, sort }],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (page) params.append('page', page.toString());
            if (limit) params.append('limit', limit.toString());
            if (search) params.append('search', search);
            if (status && status !== 'all') params.append('status', status);
            if (sort) params.append('sort', sort);
            
            const { data } = await authApi.get(`/admin/users?${params.toString()}`);
            return data;
        },
    });
};

export const useBlockUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (userId: string) => {
            const { data } = await authApi.patch(`/admin/users/${userId}/block`);
            return data;
        },
        onSuccess: () => {
            toast.success('User has been blocked');
            queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
        },
        onError: () => {
            toast.error('Failed to block user');
        }
    });
};

export const useUnblockUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (userId: string) => {
            const { data } = await authApi.patch(`/admin/users/${userId}/unblock`);
            return data;
        },
        onSuccess: () => {
            toast.success('User has been unblocked');
            queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
        },
        onError: () => {
            toast.error('Failed to unblock user');
        }
    });
};
