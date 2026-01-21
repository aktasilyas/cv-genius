import { useMutation } from '@tanstack/react-query';
import { getAnalyzeCVUseCase } from '@/infrastructure';
import { CVData } from '@/domain';
import { ValidationError, RateLimitError } from '@/application/errors/AppError';
import { toast } from 'sonner';

export interface AnalyzeCVParams {
  cvData: CVData;
}

/**
 * Hook to analyze a CV and get score
 * @returns Mutation with analyze function
 */
export const useAnalyzeCV = () => {
  return useMutation({
    mutationFn: async (params: AnalyzeCVParams) => {
      const useCase = getAnalyzeCVUseCase();
      return useCase.execute(params);
    },
    onSuccess: (data) => {
      toast.success(`CV Score: ${data.score.overall}/100`);
      return data;
    },
    onError: (error: Error) => {
      if (error instanceof ValidationError) {
        toast.error('CV needs more content to analyze');
      } else if (error instanceof RateLimitError) {
        toast.error('Too many requests. Please wait a moment.');
      } else {
        toast.error('Failed to analyze CV');
      }
    },
  });
};
