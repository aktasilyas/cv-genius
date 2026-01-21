import { ICVRepository } from '@/domain/interfaces/ICVRepository';
import { NotFoundError } from '@/application/errors/AppError';

export interface DeleteCVInput {
  id: string;
}

export class DeleteCVUseCase {
  constructor(private readonly cvRepository: ICVRepository) {}

  async execute(input: DeleteCVInput): Promise<void> {
    // Check if CV exists
    const cv = await this.cvRepository.getById(input.id);
    if (!cv) {
      throw new NotFoundError('CV', input.id);
    }

    // Delete CV
    await this.cvRepository.delete(input.id);
  }
}
