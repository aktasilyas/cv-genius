import { ICVRepository, SavedCV } from '@/domain/interfaces/ICVRepository';
import { CVData, CVDataSchema } from '@/domain';
import { CVTemplateType } from '@/domain';
import { ValidationError } from '@/application/errors/AppError';

export interface CreateCVInput {
  title: string;
  cvData: CVData;
  template: CVTemplateType;
}

export interface CreateCVOutput {
  cv: SavedCV;
}

export class CreateCVUseCase {
  constructor(private readonly cvRepository: ICVRepository) {}

  async execute(input: CreateCVInput): Promise<CreateCVOutput> {
    // Validate title
    if (!input.title.trim()) {
      throw new ValidationError('Title is required', { title: 'Title cannot be empty' });
    }

    if (input.title.length > 100) {
      throw new ValidationError('Title is too long', { title: 'Title must be 100 characters or less' });
    }

    // Validate CV data
    const validationResult = CVDataSchema.safeParse(input.cvData);
    if (!validationResult.success) {
      throw new ValidationError('Invalid CV data', this.formatZodErrors(validationResult.error));
    }

    // Create CV
    const cv = await this.cvRepository.create(
      input.title.trim(),
      validationResult.data,
      input.template
    );

    return { cv };
  }

  private formatZodErrors(error: any): Record<string, string> {
    const formatted: Record<string, string> = {};
    error.errors.forEach((err: any) => {
      const path = err.path.join('.');
      formatted[path] = err.message;
    });
    return formatted;
  }
}
