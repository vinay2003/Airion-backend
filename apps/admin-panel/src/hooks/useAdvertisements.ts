import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@ease2event/shared/auth/api';
import toast from 'react-hot-toast';

export const useAdminAdvertisements = () => {
    return useQuery({
        queryKey: ['adminAdvertisements'],
        queryFn: async () => {
            const { data } = await authApi.get('/admin/advertisements');
            return data.data || data; // fallback to data if backend format changes
        },
    });
};

export const useUpdateAdvertisementStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            const { data } = await authApi.patch(`/admin/advertisements/${id}/status`, { status });
            return data;
        },
        onSuccess: (_, variables) => {
            toast.success(`Ad status updated to ${variables.status}`);
            queryClient.invalidateQueries({ queryKey: ['adminAdvertisements'] });
        },
        onError: () => {
            toast.error('Failed to update advertisement status');
        }
    });
};
