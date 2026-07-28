import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@ease2event/shared/auth/api';
import toast from 'react-hot-toast';

export const useAdminAdvertisements = () => {
    return useQuery({
        queryKey: ['adminAdvertisements'],
        queryFn: async () => {
            const { data } = await authApi.get('/admin/advertisements');
            return data.data || data;
        },
    });
};

export const useApproveAdvertisement = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await authApi.patch(`/admin/advertisements/${id}/status`, { status: 'active' });
            return data;
        },
        onSuccess: (updatedAd) => {
            toast.success('Campaign approved successfully');
            queryClient.setQueryData(['adminAdvertisements'], (old: any) => {
                if (!old) return old;
                return old.map((ad: any) => ad.id === updatedAd.id ? updatedAd : ad);
            });
            queryClient.invalidateQueries({ queryKey: ['adminAdvertisements'] });
        },
        onError: () => {
            toast.error('Failed to approve campaign');
        }
    });
};

export const useRejectAdvertisement = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await authApi.patch(`/admin/advertisements/${id}/status`, { status: 'rejected' });
            return data;
        },
        onSuccess: (updatedAd) => {
            toast.success('Campaign rejected successfully');
            queryClient.setQueryData(['adminAdvertisements'], (old: any) => {
                if (!old) return old;
                return old.map((ad: any) => ad.id === updatedAd.id ? updatedAd : ad);
            });
            queryClient.invalidateQueries({ queryKey: ['adminAdvertisements'] });
        },
        onError: () => {
            toast.error('Failed to reject campaign');
        }
    });
};

export const useExpireAdvertisement = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await authApi.patch(`/admin/advertisements/${id}/status`, { status: 'paused' });
            return data;
        },
        onSuccess: (updatedAd) => {
            toast.success('Campaign expired successfully');
            queryClient.setQueryData(['adminAdvertisements'], (old: any) => {
                if (!old) return old;
                return old.map((ad: any) => ad.id === updatedAd.id ? updatedAd : ad);
            });
            queryClient.invalidateQueries({ queryKey: ['adminAdvertisements'] });
        },
        onError: () => {
            toast.error('Failed to expire campaign');
        }
    });
};

export const useCreateAdvertisement = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (adData: {
            vendorId: string;
            campaignName: string;
            adType: string;
            dailyBudget: number;
            totalBudget: number;
            startDate: string;
            endDate: string;
            mediaUrls?: string[];
        }) => {
            const { data } = await authApi.post('/admin/advertisements', adData);
            return data;
        },
        onSuccess: () => {
            toast.success('Campaign created successfully');
            queryClient.invalidateQueries({ queryKey: ['adminAdvertisements'] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to create campaign');
        }
    });
};
