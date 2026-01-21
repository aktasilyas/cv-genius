import { describe, it, expect, beforeEach } from 'vitest';
import { AnalyzeCVUseCase } from '@/application/use-cases/ai/AnalyzeCVUseCase';
import { createMockAIRepository, mockAnalysisResult } from '@/__tests__/mocks/repositories';
import { initialCVData } from '@/domain/entities/CVData';
import { ValidationError } from '@/application/errors/AppError';

describe('AnalyzeCVUseCase', () => {
  let useCase: AnalyzeCVUseCase;
  let mockRepository: ReturnType<typeof createMockAIRepository>;

  beforeEach(() => {
    mockRepository = createMockAIRepository();
    useCase = new AnalyzeCVUseCase(mockRepository);
  });

  it('should analyze CV and return feedback', async () => {
    const input = { cvData: initialCVData };

    const result = await useCase.execute(input);

    expect(result.analysis).toBeDefined();
    expect(result.analysis.feedback).toBeInstanceOf(Array);
    expect(result.analysis.score).toBeDefined();
    expect(result.analysis.score.overall).toBeGreaterThanOrEqual(0);
    expect(result.analysis.score.overall).toBeLessThanOrEqual(100);
    expect(mockRepository.analyzeCV).toHaveBeenCalledWith(input.cvData);
  });

  it('should include all score components', async () => {
    const input = { cvData: initialCVData };

    const result = await useCase.execute(input);

    expect(result.analysis.score.breakdown).toBeDefined();
    expect(result.analysis.score.breakdown.completeness).toBeDefined();
    expect(result.analysis.score.breakdown.quality).toBeDefined();
    expect(result.analysis.score.breakdown.atsCompatibility).toBeDefined();
    expect(result.analysis.score.breakdown.impact).toBeDefined();
  });

  it('should include recommendations', async () => {
    const input = { cvData: initialCVData };

    const result = await useCase.execute(input);

    expect(result.analysis.score.recommendations).toBeInstanceOf(Array);
    expect(result.analysis.score.recommendations.length).toBeGreaterThan(0);
  });

  it('should validate CV data before analysis', async () => {
    const invalidInput = {
      cvData: {
        ...initialCVData,
        personalInfo: {
          fullName: '', // Invalid
          email: '',
          phone: '',
          location: '',
          website: '',
          linkedin: '',
          github: '',
        },
      },
    };

    await expect(useCase.execute(invalidInput)).rejects.toThrow(ValidationError);
  });

  it('should include feedback with proper structure', async () => {
    const input = { cvData: initialCVData };

    const result = await useCase.execute(input);

    result.analysis.feedback.forEach(feedback => {
      expect(feedback).toHaveProperty('id');
      expect(feedback).toHaveProperty('section');
      expect(feedback).toHaveProperty('type');
      expect(feedback).toHaveProperty('message');
      expect(feedback).toHaveProperty('severity');
    });
  });
});
