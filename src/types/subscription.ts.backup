export type SubscriptionPlan = 'free' | 'premium';
export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due' | 'trialing';

export interface UserSubscription {
  id: string;
  user_id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  current_period_start?: string;
  current_period_end?: string;
  trial_ends_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PlanFeatures {
  templates: number; // Number of templates available (2 for free, 6 for premium)
  maxCVs: number; // Maximum CVs allowed (1 for free, unlimited for premium)
  aiAnalysis: boolean;
  aiTextParsing: boolean;
  linkedInImport: boolean;
  jobMatching: boolean;
  versionHistory: boolean;
  watermarkFree: boolean;
  prioritySupport: boolean;
}

export const PLAN_FEATURES: Record<SubscriptionPlan, PlanFeatures> = {
  free: {
    templates: 2, // Modern + Classic only
    maxCVs: 1,
    aiAnalysis: false,
    aiTextParsing: false,
    linkedInImport: false,
    jobMatching: false,
    versionHistory: false,
    watermarkFree: false,
    prioritySupport: false,
  },
  premium: {
    templates: 6, // All templates
    maxCVs: Infinity,
    aiAnalysis: true,
    aiTextParsing: true,
    linkedInImport: true,
    jobMatching: true,
    versionHistory: true,
    watermarkFree: true,
    prioritySupport: true,
  },
};

// Free templates available
export const FREE_TEMPLATES = ['modern', 'classic'] as const;
export const PREMIUM_TEMPLATES = ['minimal', 'creative', 'executive', 'technical'] as const;

// Pricing in TRY
export const PRICING = {
  monthly: 59,
  yearly: 499,
  yearlyMonthly: Math.round(499 / 12), // ~42 TRY/month
  currency: '₺',
  currencyCode: 'TRY',
};
