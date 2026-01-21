/**
 * Query Key Factory
 * Centralized query key management for React Query
 */

export const queryKeys = {
  // CV queries
  cvs: {
    all: ['cvs'] as const,
    lists: () => [...queryKeys.cvs.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.cvs.lists(), filters] as const,
    details: () => [...queryKeys.cvs.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.cvs.details(), id] as const,
  },

  // AI queries
  ai: {
    all: ['ai'] as const,
    analysis: (cvId: string) => [...queryKeys.ai.all, 'analysis', cvId] as const,
    score: (cvId: string) => [...queryKeys.ai.all, 'score', cvId] as const,
    jobMatch: (cvId: string, jobId: string) => [...queryKeys.ai.all, 'jobMatch', cvId, jobId] as const,
  },

  // Subscription queries
  subscription: {
    all: ['subscription'] as const,
    user: () => [...queryKeys.subscription.all, 'user'] as const,
    plan: () => [...queryKeys.subscription.all, 'plan'] as const,
  },

  // Auth queries
  auth: {
    all: ['auth'] as const,
    currentUser: () => [...queryKeys.auth.all, 'currentUser'] as const,
  },
} as const;
