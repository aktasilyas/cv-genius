import { IAuthRepository, User } from '@/domain/interfaces/IAuthRepository';
import { AuthenticationError } from '@/application/errors/AppError';

export interface GetCurrentUserOutput {
  user: User;
}

export class GetCurrentUserUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(): Promise<GetCurrentUserOutput> {
    const user = await this.authRepository.getCurrentUser();

    if (!user) {
      throw new AuthenticationError('No user is currently signed in');
    }

    return { user };
  }
}
