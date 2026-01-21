import { ICVRepository, SavedCV } from '@/domain/interfaces/ICVRepository';
import { NotFoundError } from '@/application/errors/AppError';

export interface GetCVByIdInput {
  id: string;
}

export interface GetCVByIdOutput {
  cv: SavedCV;
}

export class GetCVByIdUseCase {
  constructor(private readonly cvRepository: ICVRepository) {}

  async execute(input: GetCVByIdInput): Promise<GetCVByIdOutput> {
    const cv = await this.cvRepository.getById(input.id);

    if (!cv) {
      throw new NotFoundError('CV', input.id);
    }

    return { cv };
  }
}
