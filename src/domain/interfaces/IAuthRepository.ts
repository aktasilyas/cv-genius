export interface User {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  createdAt: Date;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignUpData extends AuthCredentials {
  fullName?: string;
}

export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface IAuthRepository {
  /**
   * Sign up a new user
   */
  signUp(data: SignUpData): Promise<AuthSession>;

  /**
   * Sign in an existing user
   */
  signIn(credentials: AuthCredentials): Promise<AuthSession>;

  /**
   * Sign out the current user
   */
  signOut(): Promise<void>;

  /**
   * Get the current user
   */
  getCurrentUser(): Promise<User | null>;

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): Promise<boolean>;

  /**
   * Reset password
   */
  resetPassword(email: string): Promise<void>;

  /**
   * Update password
   */
  updatePassword(newPassword: string): Promise<void>;

  /**
   * Update user profile
   */
  updateProfile(updates: Partial<Pick<User, 'fullName' | 'avatarUrl'>>): Promise<User>;
}
