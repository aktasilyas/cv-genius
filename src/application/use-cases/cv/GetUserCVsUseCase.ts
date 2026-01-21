import { ICVRepository, SavedCV } from '@/domain/interfaces/ICVRepository';

export interface GetUserCVsOutput {
  cvs: SavedCV[];
  total: number;
}

export class GetUserCVsUseCase {
  constructor(private readonly cvRepository: ICVRepository) {}

  async execute(): Promise<GetUserCVsOutput> {
    const cvs = await this.cvRepository.getAll();

    // Sort by updated date (most recent first)
    const sortedCVs = cvs.sort((a, b) =>
      b.updatedAt.getTime() - a.updatedAt.getTime()
    );

    return {
      cvs: sortedCVs,
      total: sortedCVs.length
    };
  }
}
