import { IAIService } from '@/domain/interfaces/IAIService';
import { CVData } from '@/domain';
import { ValidationError, RateLimitError } from '@/application/errors/AppError';

export interface ParseCVTextInput {
  text: string;
}

export interface ParseCVTextOutput {
  cvData: Partial<CVData>;
}

export class ParseCVTextUseCase {
  constructor(private readonly aiService: IAIService) {}

  async execute(input: ParseCVTextInput): Promise<ParseCVTextOutput> {
    // Validate input
    if (!input.text || !input.text.trim()) {
      throw new ValidationError('Text is required', {
        text: 'Please provide text to parse'
      });
    }

    if (input.text.length < 50) {
      throw new ValidationError('Text is too short', {
        text: 'Please provide at least 50 characters to parse'
      });
    }

    if (input.text.length > 10000) {
      throw new ValidationError('Text is too long', {
        text: 'Text must be 10,000 characters or less'
      });
    }

    try {
      const cvData = await this.aiService.extractFromText(input.text.trim());
      return { cvData };
    } catch (error: any) {
      if (error.message?.includes('rate limit')) {
        throw new RateLimitError('Too many parsing requests. Please try again in a few minutes.');
      }
      throw error;
    }
  }
}
