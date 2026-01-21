import { IAuthRepository, SignUpData, AuthSession } from '@/domain/interfaces/IAuthRepository';
import { ValidationError, ConflictError } from '@/application/errors/AppError';

export interface SignUpInput {
  email: string;
  password: string;
  fullName?: string;
}

export interface SignUpOutput {
  session: AuthSession;
}

export class SignUpUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(input: SignUpInput): Promise<SignUpOutput> {
    // Validate email
    if (!input.email || !input.email.trim()) {
      throw new ValidationError('Email is required', { email: 'Email cannot be empty' });
    }

    if (!this.isValidEmail(input.email)) {
      throw new ValidationError('Invalid email format', { email: 'Please enter a valid email address' });
    }

    // Validate password
    if (!input.password) {
      throw new ValidationError('Password is required', { password: 'Password cannot be empty' });
    }

    if (input.password.length < 6) {
      throw new ValidationError('Password is too short', {
        password: 'Password must be at least 6 characters'
      });
    }

    if (input.password.length > 72) {
      throw new ValidationError('Password is too long', {
        password: 'Password must be 72 characters or less'
      });
    }

    // Validate full name if provided
    if (input.fullName && input.fullName.length > 100) {
      throw new ValidationError('Name is too long', {
        fullName: 'Name must be 100 characters or less'
      });
    }

    const signUpData: SignUpData = {
      email: input.email.trim().toLowerCase(),
      password: input.password,
      fullName: input.fullName?.trim()
    };

    try {
      const session = await this.authRepository.signUp(signUpData);
      return { session };
    } catch (error: any) {
      if (error.message?.includes('already registered')) {
        throw new ConflictError('An account with this email already exists');
      }
      throw error;
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
