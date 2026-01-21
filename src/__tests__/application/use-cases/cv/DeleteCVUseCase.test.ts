import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteCVUseCase } from '@/application/use-cases/cv/DeleteCVUseCase';
import { createMockCVRepository, mockSavedCV } from '@/__tests__/mocks/repositories';
import { NotFoundError } from '@/application/errors/AppError';

describe('DeleteCVUseCase', () => {
  let useCase: DeleteCVUseCase;
  let mockRepository: ReturnType<typeof createMockCVRepository>;

  beforeEach(() => {
    mockRepository = createMockCVRepository();
    useCase = new DeleteCVUseCase(mockRepository);
  });

  it('should delete existing CV', async () => {
    const input = { id: 'test-cv-1' };

    await useCase.execute(input);

    expect(mockRepository.getById).toHaveBeenCalledWith('test-cv-1');
    expect(mockRepository.delete).toHaveBeenCalledWith('test-cv-1');
  });

  it('should throw NotFoundError for non-existing CV', async () => {
    mockRepository.getById = vi.fn().mockResolvedValue(null);

    const input = { id: 'non-existing-id' };

    await expect(useCase.execute(input)).rejects.toThrow(NotFoundError);
    await expect(useCase.execute(input)).rejects.toThrow('CV not found');
    expect(mockRepository.delete).not.toHaveBeenCalled();
  });

  it('should verify CV exists before deleting', async () => {
    const input = { id: 'test-cv-1' };

    await useCase.execute(input);

    expect(mockRepository.getById).toHaveBeenCalledBefore(mockRepository.delete as any);
  });

  it('should handle repository errors', async () => {
    const error = new Error('Database connection failed');
    mockRepository.getById = vi.fn().mockRejectedValue(error);

    const input = { id: 'test-cv-1' };

    await expect(useCase.execute(input)).rejects.toThrow(error);
  });
});
