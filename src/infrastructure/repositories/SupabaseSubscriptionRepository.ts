import { supabase } from '@/integrations/supabase/client';
import {
  ISubscriptionRepository,
  UserSubscription,
  SubscriptionPlan,
  SubscriptionStatus
} from '@/domain/interfaces/ISubscriptionRepository';

export class SupabaseSubscriptionRepository implements ISubscriptionRepository {

  private mapToEntity(row: any): UserSubscription {
    return {
      id: row.id,
      userId: row.user_id,
      plan: row.plan as SubscriptionPlan,
      status: row.status as SubscriptionStatus,
      stripeCustomerId: row.stripe_customer_id,
      stripeSubscriptionId: row.stripe_subscription_id,
      currentPeriodStart: row.current_period_start ? new Date(row.current_period_start) : undefined,
      currentPeriodEnd: row.current_period_end ? new Date(row.current_period_end) : undefined,
      cancelAtPeriodEnd: row.cancel_at_period_end ?? false,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

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

    return this.mapToEntity(data);
  }

  async createFreeSubscription(userId: string): Promise<UserSubscription> {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id: userId,
        plan: 'free',
        status: 'active'
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapToEntity(data);
  }

  async isPremium(): Promise<boolean> {
    const subscription = await this.getUserSubscription();
    return subscription?.plan === 'premium' && subscription?.status === 'active';
  }

  async getUserPlan(): Promise<SubscriptionPlan> {
    const subscription = await this.getUserSubscription();
    if (!subscription) return 'free';
    if (subscription.status !== 'active') return 'free';
    return subscription.plan;
  }

  async updateSubscription(userId: string, updates: Partial<UserSubscription>): Promise<UserSubscription> {
    const updateData: Record<string, unknown> = {};

    if (updates.plan !== undefined) updateData.plan = updates.plan;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.stripeCustomerId !== undefined) updateData.stripe_customer_id = updates.stripeCustomerId;
    if (updates.stripeSubscriptionId !== undefined) updateData.stripe_subscription_id = updates.stripeSubscriptionId;
    if (updates.currentPeriodStart !== undefined) updateData.current_period_start = updates.currentPeriodStart;
    if (updates.currentPeriodEnd !== undefined) updateData.current_period_end = updates.currentPeriodEnd;
    if (updates.cancelAtPeriodEnd !== undefined) updateData.cancel_at_period_end = updates.cancelAtPeriodEnd;

    const { data, error } = await supabase
      .from('user_subscriptions')
      .update(updateData)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapToEntity(data);
  }

  async cancelSubscription(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('user_subscriptions')
      .update({
        cancel_at_period_end: true,
        status: 'canceled'
      })
      .eq('user_id', user.id);

    if (error) throw new Error(error.message);
  }
}
