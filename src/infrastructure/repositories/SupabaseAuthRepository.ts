import { supabase } from '@/integrations/supabase/client';
import {
  IAuthRepository,
  User,
  AuthCredentials,
  SignUpData,
  AuthSession
} from '@/domain/interfaces/IAuthRepository';

export class SupabaseAuthRepository implements IAuthRepository {

  private mapToUser(supabaseUser: any): User {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email!,
      fullName: supabaseUser.user_metadata?.full_name,
      avatarUrl: supabaseUser.user_metadata?.avatar_url,
      createdAt: new Date(supabaseUser.created_at)
    };
  }

  async signUp(data: SignUpData): Promise<AuthSession> {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName
        }
      }
    });

    if (error) throw new Error(error.message);
    if (!authData.user || !authData.session) {
      throw new Error('Sign up failed');
    }

    return {
      user: this.mapToUser(authData.user),
      accessToken: authData.session.access_token,
      refreshToken: authData.session.refresh_token
    };
  }

  async signIn(credentials: AuthCredentials): Promise<AuthSession> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    });

    if (error) throw new Error(error.message);
    if (!data.user || !data.session) {
      throw new Error('Sign in failed');
    }

    return {
      user: this.mapToUser(data.user),
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token
    };
  }

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw new Error(error.message);
    if (!user) return null;
    return this.mapToUser(user);
  }

  async isAuthenticated(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
  }

  async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    if (error) throw new Error(error.message);
  }

  async updatePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    if (error) throw new Error(error.message);
  }

  async updateProfile(updates: Partial<Pick<User, 'fullName' | 'avatarUrl'>>): Promise<User> {
    const metadata: Record<string, unknown> = {};
    if (updates.fullName !== undefined) metadata.full_name = updates.fullName;
    if (updates.avatarUrl !== undefined) metadata.avatar_url = updates.avatarUrl;

    const { data, error } = await supabase.auth.updateUser({
      data: metadata
    });

    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('User update failed');

    return this.mapToUser(data.user);
  }
}
