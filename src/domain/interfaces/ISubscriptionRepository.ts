export type SubscriptionPlan = 'free' | 'premium';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing';

export interface UserSubscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubscriptionRepository {
  /**
   * Get user's current subscription
   */
  getUserSubscription(): Promise<UserSubscription | null>;

  /**
   * Create a free subscription for a new user
   */
  createFreeSubscription(userId: string): Promise<UserSubscription>;

  /**
   * Check if user has premium access
   */
  isPremium(): Promise<boolean>;

  /**
   * Get user's current plan
   */
  getUserPlan(): Promise<SubscriptionPlan>;

  /**
   * Update subscription (called by webhook)
   */
  updateSubscription(userId: string, updates: Partial<UserSubscription>): Promise<UserSubscription>;

  /**
   * Cancel subscription
   */
  cancelSubscription(): Promise<void>;
}
