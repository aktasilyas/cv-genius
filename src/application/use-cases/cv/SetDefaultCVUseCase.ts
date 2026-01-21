import { ICVRepository } from '@/domain/interfaces/ICVRepository';
import { NotFoundError } from '@/application/errors/AppError';

export interface SetDefaultCVInput {
  id: string;
}

export class SetDefaultCVUseCase {
  constructor(private readonly cvRepository: ICVRepository) {}

  async execute(input: SetDefaultCVInput): Promise<void> {
    // Check if CV exists
    const cv = await this.cvRepository.getById(input.id);
    if (!cv) {
      throw new NotFoundError('CV', input.id);
    }

    // Set as default
    await this.cvRepository.setDefault(input.id);
  }
}
