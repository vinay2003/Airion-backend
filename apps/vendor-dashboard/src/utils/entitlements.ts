import { ActiveSubscription } from '../hooks/useVendorSubscription';

export type FeatureKey = 
  | 'ADVANCED_ANALYTICS' 
  | 'AI_INSIGHTS' 
  | 'CUSTOM_BRANDING' 
  | 'PREMIUM_SUPPORT' 
  | 'ADVANCED_LEADS';

/**
 * Validates if the subscription is active and not expired
 */
export const isSubscriptionValid = (subscription?: ActiveSubscription | null): boolean => {
    if (!subscription) return false;
    if (subscription.status !== 'active') return false;
    
    const currentDate = new Date();
    const endDate = new Date(subscription.currentPeriodEnd);
    return endDate >= currentDate;
};

/**
 * Checks if the vendor's active subscription includes the requested feature
 */
export const hasFeature = (feature: FeatureKey, subscription?: ActiveSubscription | null): boolean => {
    if (!isSubscriptionValid(subscription)) return false;
    
    // Safety check for features array
    if (!subscription?.plan?.features || !Array.isArray(subscription.plan.features)) {
        return false;
    }
    
    // Normalizes feature keys (backend features might be stored in lowercase or slightly differently)
    // Here we check if the requested feature is present in the plan's feature list.
    const planFeatures = subscription.plan.features.map(f => f.toUpperCase().replace(/\s+/g, '_'));
    return planFeatures.includes(feature);
};
