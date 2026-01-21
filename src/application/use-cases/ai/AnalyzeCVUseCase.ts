import { IAIService, CVScore } from '@/domain/interfaces/IAIService';
import { CVData, CVDataSchema } from '@/domain';
import { ValidationError, RateLimitError } from '@/application/errors/AppError';

export interface AnalyzeCVInput {
  cvData: CVData;
}

export interface AnalyzeCVOutput {
  score: CVScore;
}

export class AnalyzeCVUseCase {
  constructor(private readonly aiService: IAIService) {}

  async execute(input: AnalyzeCVInput): Promise<AnalyzeCVOutput> {
    // Validate CV data
    const validationResult = CVDataSchema.safeParse(input.cvData);
    if (!validationResult.success) {
      throw new ValidationError('Invalid CV data for analysis');
    }

    // Check if CV has enough content
    const hasContent = this.validateCVHasContent(validationResult.data);
    if (!hasContent) {
      throw new ValidationError(
        'CV must have some content to analyze',
        {
          content: 'Please add personal information, summary, or experience before analyzing'
        }
      );
    }

    try {
      const score = await this.aiService.scoreCv(validationResult.data);
      return { score };
    } catch (error: any) {
      if (error.message?.includes('rate limit')) {
        throw new RateLimitError('Too many analysis requests. Please try again in a few minutes.');
      }
      throw error;
    }
  }

  private validateCVHasContent(cvData: CVData): boolean {
    return !!(
      cvData.personalInfo.fullName ||
      cvData.summary ||
      cvData.experience.length > 0 ||
      cvData.education.length > 0 ||
      cvData.skills.length > 0
    );
  }
}
