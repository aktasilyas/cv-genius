import { IAuthRepository } from '@/domain/interfaces/IAuthRepository';

export class SignOutUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(): Promise<void> {
    await this.authRepository.signOut();
  }
}
