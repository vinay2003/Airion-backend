import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { SubscriptionPlan } from './useVendorSubscription';

export function useVendorSubscriptionPlans() {
    const { data: plans = [], isLoading, error } = useQuery<SubscriptionPlan[], Error>({
        queryKey: ['subscription-plans', 'vendor'],
        queryFn: async () => {
            try {
                const response: any = await api.get('/subscriptions/plans', { params: { type: 'vendor' } });
                const data = response.data?.data || response.data;
                return Array.isArray(data) ? data : [];
            } catch (err: any) {
                throw new Error(err.message || 'Failed to fetch subscription plans');
            }
        },
        staleTime: 1000 * 60 * 15, // 15 minutes cache
    });

    const activePlans = plans.filter(p => p.isActive);
    
    // Recommended plan is the active plan with the highest priority
    // If priorities are equal, fallback to highest price
    const recommendedPlan = activePlans.length > 0 
        ? [...activePlans].sort((a, b) => {
            // Wait, does SubscriptionPlan have priority? Let's check PremiumUpgrade.tsx and Subscriptions.tsx
            // Subscriptions.tsx has priority: number. So we assume it's there.
            const priorityA = (a as any).priority || 0;
            const priorityB = (b as any).priority || 0;
            if (priorityB !== priorityA) {
                return priorityB - priorityA; // descending
            }
            return b.price - a.price; // descending
        })[0]
        : null;

    return {
        plans,
        activePlans,
        recommendedPlan,
        isLoading,
        error,
    };
}
