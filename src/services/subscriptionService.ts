import { supabase } from '@/integrations/supabase/client';
import { UserSubscription, SubscriptionPlan } from '@/types/subscription';

export const subscriptionService = {
  async getUserSubscription(): Promise<UserSubscription | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      // If no subscription exists, create a free one
      if (error.code === 'PGRST116') {
        return this.createFreeSubscription(user.id);
      }
      console.error('Error fetching subscription:', error);
      return null;
    }

    return data as unknown as UserSubscription;
  },

  async createFreeSubscription(userId: string): Promise<UserSubscription | null> {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id: userId,
        plan: 'free',
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating subscription:', error);
      return null;
    }

    return data as unknown as UserSubscription;
  },

  async isPremium(): Promise<boolean> {
    const subscription = await this.getUserSubscription();
    return subscription?.plan === 'premium' && subscription?.status === 'active';
  },

  async getUserPlan(): Promise<SubscriptionPlan> {
    const subscription = await this.getUserSubscription();
    if (!subscription) return 'free';
    if (subscription.status !== 'active') return 'free';
    return subscription.plan;
  },

  // This will be called by Stripe webhook (edge function)
  async updateSubscription(
    userId: string,
    updates: Partial<UserSubscription>
  ): Promise<UserSubscription | null> {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating subscription:', error);
      return null;
    }

    return data as unknown as UserSubscription;
  },
};
