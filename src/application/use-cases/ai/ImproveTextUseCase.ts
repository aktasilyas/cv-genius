import { IAIService } from '@/domain/interfaces/IAIService';
import { ValidationError, RateLimitError } from '@/application/errors/AppError';

export interface ImproveTextInput {
  text: string;
  context: string;
}

export interface ImproveTextOutput {
  improvedText: string;
}

export class ImproveTextUseCase {
  constructor(private readonly aiService: IAIService) {}

  async execute(input: ImproveTextInput): Promise<ImproveTextOutput> {
    // Validate text
    if (!input.text || !input.text.trim()) {
      throw new ValidationError('Text is required', {
        text: 'Please provide text to improve'
      });
    }

    if (input.text.length < 10) {
      throw new ValidationError('Text is too short', {
        text: 'Please provide at least 10 characters to improve'
      });
    }

    if (input.text.length > 1000) {
      throw new ValidationError('Text is too long', {
        text: 'Text must be 1,000 characters or less'
      });
    }

    // Validate context
    if (!input.context || !input.context.trim()) {
      throw new ValidationError('Context is required', {
        context: 'Please specify the context (e.g., "summary", "achievement")'
      });
    }

    try {
      const improvedText = await this.aiService.improveText(
        input.text.trim(),
        input.context.trim()
      );

      return { improvedText };
    } catch (error: any) {
      if (error.message?.includes('rate limit')) {
        throw new RateLimitError('Too many improvement requests. Please try again in a few minutes.');
      }
      throw error;
    }
  }
}
