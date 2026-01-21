import { IAuthRepository, AuthCredentials, AuthSession } from '@/domain/interfaces/IAuthRepository';
import { ValidationError } from '@/application/errors/AppError';

export interface SignInInput {
  email: string;
  password: string;
}

export interface SignInOutput {
  session: AuthSession;
}

export class SignInUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(input: SignInInput): Promise<SignInOutput> {
    // Validate input
    if (!input.email || !input.email.trim()) {
      throw new ValidationError('Email is required', { email: 'Email cannot be empty' });
    }

    if (!this.isValidEmail(input.email)) {
      throw new ValidationError('Invalid email format', { email: 'Please enter a valid email address' });
    }

    if (!input.password || input.password.length < 6) {
      throw new ValidationError('Invalid password', { password: 'Password must be at least 6 characters' });
    }

    const credentials: AuthCredentials = {
      email: input.email.trim().toLowerCase(),
      password: input.password
    };

    try {
      const session = await this.authRepository.signIn(credentials);
      return { session };
    } catch (error: any) {
      throw new ValidationError('Invalid email or password', {
        credentials: 'Please check your email and password'
      });
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
