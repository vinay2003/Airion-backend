import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { useAuth } from '@ease2event/shared';

export interface SubscriptionPlan {
    id: string;
    name: string;
    description: string;
    price: number;
    billingCycle: 'monthly' | 'yearly';
    features: string[];
    isActive: boolean;
    priority?: number;
}

export interface ActiveSubscription {
    id: string;
    status: 'active' | 'cancelled' | 'expired' | 'past_due';
    currentPeriodStart: string;
    currentPeriodEnd: string;
    autoRenew: boolean;
    plan: SubscriptionPlan;
}

export function useVendorSubscription() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const vendorId = user?.vendor?.id || user?.id;

    const { data: subscription, isLoading, error, refetch } = useQuery<ActiveSubscription | null, Error>({
        queryKey: ['vendorSubscription', vendorId],
        queryFn: async () => {
            if (!vendorId) return null;
            try {
                const response: any = await api.get('/subscriptions/my-plan');
                const data = response.data?.data || response.data;
                if (data && data.status) {
                    return data as ActiveSubscription;
                }
                return null;
            } catch (err: any) {
                if (err.response?.status === 404) {
                    return null;
                }
                throw new Error(err.message || 'Failed to fetch subscription');
            }
        },
        enabled: !!vendorId,
        staleTime: 1000 * 60 * 5, // 5 minutes cache
    });

    const isPremium = (): boolean => {
        if (!subscription) return false;
        
        // Check if status is active
        if (subscription.status !== 'active') return false;
        
        // Check if subscription has expired
        const currentDate = new Date();
        const endDate = new Date(subscription.currentPeriodEnd);
        if (endDate < currentDate) return false;
        
        return true;
    };

    const invalidateSubscription = async () => {
        await queryClient.invalidateQueries({ queryKey: ['vendorSubscription', vendorId] });
    };

    return {
        subscription: subscription || null,
        plan: subscription?.plan || null,
        isPremium: isPremium(),
        isLoading,
        error: error ? error.message : null,
        refetch: invalidateSubscription, // Overriding refetch to trigger global cache invalidation
    };
}
