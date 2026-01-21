import { ICVRepository, SavedCV } from '@/domain/interfaces/ICVRepository';
import { NotFoundError } from '@/application/errors/AppError';

export interface DuplicateCVInput {
  id: string;
}

export interface DuplicateCVOutput {
  cv: SavedCV;
}

export class DuplicateCVUseCase {
  constructor(private readonly cvRepository: ICVRepository) {}

  async execute(input: DuplicateCVInput): Promise<DuplicateCVOutput> {
    // Check if CV exists
    const original = await this.cvRepository.getById(input.id);
    if (!original) {
      throw new NotFoundError('CV', input.id);
    }

    // Duplicate CV
    const cv = await this.cvRepository.duplicate(input.id);
    return { cv };
  }
}
