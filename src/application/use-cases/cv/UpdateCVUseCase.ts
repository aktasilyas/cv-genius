import { ICVRepository, SavedCV } from '@/domain/interfaces/ICVRepository';
import { CVData, CVDataSchema } from '@/domain';
import { CVTemplateType } from '@/domain';
import { ValidationError, NotFoundError } from '@/application/errors/AppError';

export interface UpdateCVInput {
  id: string;
  title?: string;
  cvData?: CVData;
  selectedTemplate?: CVTemplateType;
}

export interface UpdateCVOutput {
  cv: SavedCV;
}

export class UpdateCVUseCase {
  constructor(private readonly cvRepository: ICVRepository) {}

  async execute(input: UpdateCVInput): Promise<UpdateCVOutput> {
    // Check if CV exists
    const existingCV = await this.cvRepository.getById(input.id);
    if (!existingCV) {
      throw new NotFoundError('CV', input.id);
    }

    // Validate title if provided
    if (input.title !== undefined) {
      if (!input.title.trim()) {
        throw new ValidationError('Title is required', { title: 'Title cannot be empty' });
      }
      if (input.title.length > 100) {
        throw new ValidationError('Title is too long', { title: 'Title must be 100 characters or less' });
      }
    }

    // Validate CV data if provided
    if (input.cvData !== undefined) {
      const validationResult = CVDataSchema.safeParse(input.cvData);
      if (!validationResult.success) {
        throw new ValidationError('Invalid CV data', this.formatZodErrors(validationResult.error));
      }
    }

    // Prepare updates
    const updates: Partial<Pick<SavedCV, 'title' | 'cvData' | 'selectedTemplate'>> = {};
    if (input.title !== undefined) updates.title = input.title.trim();
    if (input.cvData !== undefined) updates.cvData = input.cvData;
    if (input.selectedTemplate !== undefined) updates.selectedTemplate = input.selectedTemplate;

    // Update CV
    const cv = await this.cvRepository.update(input.id, updates);
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
