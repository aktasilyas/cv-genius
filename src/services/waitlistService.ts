import { supabase } from '@/integrations/supabase/client';

export interface WaitlistEntry {
  id: string;
  email: string;
  name?: string;
  job_title?: string;
  industry?: string;
  language_preference: string;
  source: string;
  user_id?: string;
  status: 'pending' | 'notified' | 'converted';
  created_at: string;
  updated_at: string;
}

export interface JoinWaitlistData {
  email: string;
  name?: string;
  job_title?: string;
  industry?: string;
  language_preference?: string;
  source?: string;
}

export const waitlistService = {
  async joinWaitlist(data: JoinWaitlistData): Promise<{ success: boolean; error?: string }> {
    try {
      // Get current user ID if logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('waitlist_entries')
        .insert({
          email: data.email,
          name: data.name || null,
          job_title: data.job_title || null,
          industry: data.industry || null,
          language_preference: data.language_preference || 'en',
          source: data.source || 'app',
          user_id: user?.id || null,
        });

      if (error) {
        // Handle duplicate email
        if (error.code === '23505') {
          return { success: false, error: 'already_registered' };
        }
        console.error('Error joining waitlist:', error);
        return { success: false, error: 'failed' };
      }

      return { success: true };
    } catch (err) {
      console.error('Error joining waitlist:', err);
      return { success: false, error: 'failed' };
    }
  },

  async isOnWaitlist(email: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('waitlist_entries')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (error) {
        console.error('Error checking waitlist:', error);
        return false;
      }

      return !!data;
    } catch (err) {
      console.error('Error checking waitlist:', err);
      return false;
    }
  },

  async getWaitlistCount(): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('waitlist_entries')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error getting waitlist count:', error);
        return 0;
      }

      return count || 0;
    } catch (err) {
      console.error('Error getting waitlist count:', err);
      return 0;
    }
  },
};
