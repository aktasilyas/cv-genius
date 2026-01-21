import { IAIService, JobMatch } from '@/domain/interfaces/IAIService';
import { CVData, CVDataSchema } from '@/domain';
import { ValidationError, RateLimitError } from '@/application/errors/AppError';

export interface MatchJobInput {
  cvData: CVData;
  jobDescription: string;
}

export interface MatchJobOutput {
  match: JobMatch;
}

export class MatchJobUseCase {
  constructor(private readonly aiService: IAIService) {}

  async execute(input: MatchJobInput): Promise<MatchJobOutput> {
    // Validate CV data
    const validationResult = CVDataSchema.safeParse(input.cvData);
    if (!validationResult.success) {
      throw new ValidationError('Invalid CV data for job matching');
    }

    // Validate job description
    if (!input.jobDescription || !input.jobDescription.trim()) {
      throw new ValidationError('Job description is required', {
        jobDescription: 'Please provide a job description to match against'
      });
    }

    if (input.jobDescription.length < 50) {
      throw new ValidationError('Job description is too short', {
        jobDescription: 'Please provide a more detailed job description (at least 50 characters)'
      });
    }

    if (input.jobDescription.length > 5000) {
      throw new ValidationError('Job description is too long', {
        jobDescription: 'Job description must be 5,000 characters or less'
      });
    }

    try {
      const match = await this.aiService.matchJob(validationResult.data, input.jobDescription.trim());
      return { match };
    } catch (error: any) {
      if (error.message?.includes('rate limit')) {
        throw new RateLimitError('Too many matching requests. Please try again in a few minutes.');
      }
      throw error;
    }
  }
}
