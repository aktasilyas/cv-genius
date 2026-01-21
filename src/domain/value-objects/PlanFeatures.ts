import { z } from 'zod';

export const SubscriptionPlanSchema = z.enum(['free', 'premium']);
export type SubscriptionPlan = z.infer<typeof SubscriptionPlanSchema>;

export interface PlanFeatures {
  templates: number;
  maxCVs: number;
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
    templates: 2,
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
    templates: 6,
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

export const FREE_TEMPLATES = ['modern', 'classic'] as const;
export const PREMIUM_TEMPLATES = ['minimal', 'creative', 'executive', 'technical'] as const;

export const PRICING = {
  monthly: 59,
  yearly: 499,
  yearlyMonthly: Math.round(499 / 12),
  currency: '₺',
  currencyCode: 'TRY',
};

export const getPlanFeatures = (plan: SubscriptionPlan): PlanFeatures => {
  return PLAN_FEATURES[plan];
};

export const hasFeature = (plan: SubscriptionPlan, feature: keyof PlanFeatures): boolean => {
  return !!PLAN_FEATURES[plan][feature];
};
