import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateCVUseCase } from '@/application/use-cases/cv/CreateCVUseCase';
import { createMockCVRepository, mockSavedCV } from '@/__tests__/mocks/repositories';
import { initialCVData } from '@/domain/entities/CVData';
import { ValidationError } from '@/application/errors/AppError';

describe('CreateCVUseCase', () => {
  let useCase: CreateCVUseCase;
  let mockRepository: ReturnType<typeof createMockCVRepository>;

  beforeEach(() => {
    mockRepository = createMockCVRepository();
    useCase = new CreateCVUseCase(mockRepository);
  });

  it('should create CV with valid data', async () => {
    const input = {
      title: 'My Professional CV',
      cvData: initialCVData,
      template: 'modern' as const,
    };

    const result = await useCase.execute(input);

    expect(result.cv).toBeDefined();
    expect(result.cv.title).toBe('My Professional CV');
    expect(mockRepository.create).toHaveBeenCalledWith(
      input.title,
      input.cvData,
      input.template
    );
  });

  it('should throw ValidationError for empty title', async () => {
    const input = {
      title: '',
      cvData: initialCVData,
      template: 'modern' as const,
    };

    await expect(useCase.execute(input)).rejects.toThrow(ValidationError);
    await expect(useCase.execute(input)).rejects.toThrow('Title is required');
    expect(mockRepository.create).not.toHaveBeenCalled();
  });

  it('should throw ValidationError for whitespace-only title', async () => {
    const input = {
      title: '   ',
      cvData: initialCVData,
      template: 'modern' as const,
    };

    await expect(useCase.execute(input)).rejects.toThrow(ValidationError);
    expect(mockRepository.create).not.toHaveBeenCalled();
  });

  it('should trim title before creating CV', async () => {
    const input = {
      title: '  My CV  ',
      cvData: initialCVData,
      template: 'modern' as const,
    };

    await useCase.execute(input);

    expect(mockRepository.create).toHaveBeenCalledWith(
      'My CV',
      input.cvData,
      input.template
    );
  });

  it('should throw ValidationError for invalid CV data', async () => {
    const input = {
      title: 'Valid Title',
      cvData: {
        ...initialCVData,
        personalInfo: {
          fullName: '', // Invalid - empty name
          email: 'invalid-email', // Invalid email
          phone: '',
          location: '',
          website: '',
          linkedin: '',
          github: '',
        },
      },
      template: 'modern' as const,
    };

    await expect(useCase.execute(input)).rejects.toThrow(ValidationError);
  });

  it('should accept all valid template types', async () => {
    const templates = ['modern', 'classic', 'minimal', 'creative', 'executive', 'technical'] as const;

    for (const template of templates) {
      const input = {
        title: 'Test CV',
        cvData: initialCVData,
        template,
      };

      await useCase.execute(input);
      expect(mockRepository.create).toHaveBeenCalledWith(input.title, input.cvData, template);
    }
  });
});
