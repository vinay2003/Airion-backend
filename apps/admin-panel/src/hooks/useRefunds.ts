import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@ease2event/shared/auth/api';
import toast from 'react-hot-toast';

export const useAdminRefunds = (status?: string) => {
    return useQuery({
        queryKey: ['adminRefunds', status],
        queryFn: async () => {
            const url = status ? `/refunds/admin/all?status=${status}` : '/refunds/admin/all';
            const { data } = await authApi.get(url);
            return data;
        },
    });
};

export const useApproveRefund = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, adminRemark }: { id: string; adminRemark?: string }) => {
            const { data } = await authApi.patch(`/refunds/${id}/approve`, { adminRemark });
            return data;
        },
        onSuccess: () => {
            toast.success('Refund approved successfully');
            queryClient.invalidateQueries({ queryKey: ['adminRefunds'] });
        },
        onError: () => {
            toast.error('Failed to approve refund');
        }
    });
};

export const useRejectRefund = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, adminRemark }: { id: string; adminRemark: string }) => {
            const { data } = await authApi.patch(`/refunds/${id}/reject`, { adminRemark });
            return data;
        },
        onSuccess: () => {
            toast.success('Refund rejected successfully');
            queryClient.invalidateQueries({ queryKey: ['adminRefunds'] });
        },
        onError: () => {
            toast.error('Failed to reject refund');
        }
    });
};

export const useCompleteRefund = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await authApi.patch(`/refunds/${id}/complete`);
            return data;
        },
        onSuccess: () => {
            toast.success('Refund marked as completed');
            queryClient.invalidateQueries({ queryKey: ['adminRefunds'] });
        },
        onError: () => {
            toast.error('Failed to complete refund');
        }
    });
};
