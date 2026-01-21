/**
 * @deprecated Use ISubscriptionRepository from '@/infrastructure' instead
 * This file is kept for backwards compatibility
 */

import { getSubscriptionRepository } from '@/infrastructure';
import { UserSubscription, SubscriptionPlan } from '@/domain';

/**
 * @deprecated Use getSubscriptionRepository() from '@/infrastructure' instead
 */
export const subscriptionService = {
  async getUserSubscription(): Promise<UserSubscription | null> {
    const repo = getSubscriptionRepository();
    return repo.getUserSubscription();
  },

  async createFreeSubscription(userId: string): Promise<UserSubscription | null> {
    const repo = getSubscriptionRepository();
    try {
      return await repo.createFreeSubscription(userId);
    } catch (error) {
      console.error('Error creating subscription:', error);
      return null;
    }
  },

  async isPremium(): Promise<boolean> {
    const repo = getSubscriptionRepository();
    return repo.isPremium();
  },

  async getUserPlan(): Promise<SubscriptionPlan> {
    const repo = getSubscriptionRepository();
    return repo.getUserPlan();
  },

  async updateSubscription(
    userId: string,
    updates: Partial<UserSubscription>
  ): Promise<UserSubscription | null> {
    const repo = getSubscriptionRepository();
    try {
      return await repo.updateSubscription(userId, updates);
    } catch (error) {
      console.error('Error updating subscription:', error);
      return null;
    }
  }
};
