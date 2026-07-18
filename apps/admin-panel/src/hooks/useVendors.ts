import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@ease2event/shared/auth/api';
import toast from 'react-hot-toast';

export const useAdminVendors = (page: number, limit: number, search: string, status: string, category: string) => {
    return useQuery({
        queryKey: ['adminVendors', { page, limit, search, status, category }],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (page) params.append('page', page.toString());
            if (limit) params.append('limit', limit.toString());
            if (search) params.append('search', search);
            if (status && status !== 'all') params.append('status', status);
            if (category && category !== 'all') params.append('category', category);
            
            const { data } = await authApi.get(`/admin/vendors?${params.toString()}`);
            return data;
        },
    });
};

export const useVendorDetails = (vendorId: string | null) => {
    return useQuery({
        queryKey: ['adminVendorDetails', vendorId],
        queryFn: async () => {
            const { data } = await authApi.get(`/admin/vendors/${vendorId}`);
            return data;
        },
        enabled: !!vendorId
    });
}

export const useVerifyVendor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ vendorId, status, rejectionReason }: { vendorId: string, status: 'approved' | 'rejected', rejectionReason?: string }) => {
            const { data } = await authApi.patch(`/vendors/${vendorId}/status`, { status, rejectionReason });
            return data;
        },
        onSuccess: (data, variables) => {
            toast.success(`Vendor ${variables.status} successfully`);
            queryClient.invalidateQueries({ queryKey: ['adminVendors'] });
            queryClient.invalidateQueries({ queryKey: ['adminVendorDetails', variables.vendorId] });
        },
        onError: () => {
            toast.error('Failed to update vendor verification status');
        }
    });
};

export const useSuspendVendor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (vendorId: string) => {
            const { data } = await authApi.post(`/admin/vendors/${vendorId}/suspend`);
            return data;
        },
        onSuccess: (data, variables) => {
            toast.success('Vendor has been suspended');
            queryClient.invalidateQueries({ queryKey: ['adminVendors'] });
            queryClient.invalidateQueries({ queryKey: ['adminVendorDetails', variables] });
        },
        onError: () => {
            toast.error('Failed to suspend vendor');
        }
    });
};
