import React, { createContext, useContext, ReactNode } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { UserSubscription, SubscriptionPlan, PlanFeatures } from '@/types/subscription';
import { CVTemplate } from '@/types/cv';

interface SubscriptionContextType {
  subscription: UserSubscription | null;
  plan: SubscriptionPlan;
  features: PlanFeatures;
  isPremium: boolean;
  isLoading: boolean;
  error: string | null;
  canUseFeature: (feature: keyof PlanFeatures) => boolean;
  canUseTemplate: (template: CVTemplate) => boolean;
  isTemplateAvailable: (template: CVTemplate) => boolean;
  getMaxCVs: () => number;
  refetch: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const subscriptionData = useSubscription();

  return (
    <SubscriptionContext.Provider value={subscriptionData}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscriptionContext = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscriptionContext must be used within a SubscriptionProvider');
  }
  return context;
};
