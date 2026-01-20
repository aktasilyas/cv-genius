import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { subscriptionService } from '@/services/subscriptionService';
import { 
  UserSubscription, 
  SubscriptionPlan, 
  PLAN_FEATURES, 
  FREE_TEMPLATES,
  PlanFeatures 
} from '@/types/subscription';
import { CVTemplate } from '@/types/cv';

export function useSubscription() {
  const { isAuthenticated, user } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = useCallback(async () => {
    if (!isAuthenticated) {
      setSubscription(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const sub = await subscriptionService.getUserSubscription();
      setSubscription(sub);
      setError(null);
    } catch (err) {
      console.error('Error fetching subscription:', err);
      setError('Failed to load subscription');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const plan: SubscriptionPlan = subscription?.plan === 'premium' && subscription?.status === 'active' 
    ? 'premium' 
    : 'free';

  const features: PlanFeatures = PLAN_FEATURES[plan];

  const isPremium = plan === 'premium';

  const canUseFeature = useCallback((feature: keyof PlanFeatures): boolean => {
    return features[feature] as boolean;
  }, [features]);

  const canUseTemplate = useCallback((template: CVTemplate): boolean => {
    if (isPremium) return true;
    return (FREE_TEMPLATES as readonly string[]).includes(template);
  }, [isPremium]);

  const isTemplateAvailable = useCallback((template: CVTemplate): boolean => {
    return canUseTemplate(template);
  }, [canUseTemplate]);

  const getMaxCVs = useCallback((): number => {
    return features.maxCVs;
  }, [features]);

  const refetch = useCallback(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  return {
    subscription,
    plan,
    features,
    isPremium,
    isLoading,
    error,
    canUseFeature,
    canUseTemplate,
    isTemplateAvailable,
    getMaxCVs,
    refetch,
  };
}
