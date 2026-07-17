import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@ease2event/shared/auth/api';
import toast from 'react-hot-toast';

export const useAdminCoupons = () => {
    return useQuery({
        queryKey: ['adminCoupons'],
        queryFn: async () => {
            const { data } = await authApi.get('/admin/coupons');
            return data.data || data;
        },
    });
};

export const useCreateCoupon = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (couponData: any) => {
            const { data } = await authApi.post('/admin/coupons', couponData);
            return data;
        },
        onSuccess: () => {
            toast.success('Coupon created successfully');
            queryClient.invalidateQueries({ queryKey: ['adminCoupons'] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to create coupon');
        }
    });
};

export const useDeleteCoupon = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await authApi.delete(`/admin/coupons/${id}`);
            return data;
        },
        onSuccess: () => {
            toast.success('Coupon deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['adminCoupons'] });
        },
        onError: () => {
            toast.error('Failed to delete coupon');
        }
    });
};
