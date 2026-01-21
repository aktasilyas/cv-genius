import { ICVRepository, SavedCV } from '@/domain/interfaces/ICVRepository';
import { NotFoundError, ValidationError } from '@/application/errors/AppError';
import { isComplete } from '@/domain';

export interface ExportCVInput {
  id: string;
  format: 'pdf' | 'docx' | 'json';
}

export interface ExportCVOutput {
  cv: SavedCV;
  format: 'pdf' | 'docx' | 'json';
}

export class ExportCVUseCase {
  constructor(private readonly cvRepository: ICVRepository) {}

  async execute(input: ExportCVInput): Promise<ExportCVOutput> {
    // Check if CV exists
    const cv = await this.cvRepository.getById(input.id);
    if (!cv) {
      throw new NotFoundError('CV', input.id);
    }

    // Validate CV is complete enough for export
    if (!isComplete(cv.cvData)) {
      throw new ValidationError(
        'CV must have personal info, summary, experience, and education to export',
        {
          export: 'Please fill in the required sections before exporting'
        }
      );
    }

    return {
      cv,
      format: input.format
    };
  }
}
