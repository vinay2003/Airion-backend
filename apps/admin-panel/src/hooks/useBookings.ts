import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@ease2event/shared/auth/api';
import toast from 'react-hot-toast';

export const useAdminBookings = (page: number = 1, limit: number = 50) => {
    return useQuery({
        queryKey: ['adminBookings', page, limit],
        queryFn: async () => {
            const { data } = await authApi.get(`/admin/bookings?page=${page}&limit=${limit}`);
            return data;
        },
    });
};

export const useUpdateBookingStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            const { data } = await authApi.patch(`/admin/bookings/${id}/status`, { status });
            return data;
        },
        onSuccess: (_, variables) => {
            toast.success(`Booking status updated to ${variables.status}`);
            queryClient.invalidateQueries({ queryKey: ['adminBookings'] });
        },
        onError: () => {
            toast.error('Failed to update booking status');
        }
    });
};
