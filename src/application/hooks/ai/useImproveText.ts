import { useMutation } from '@tanstack/react-query';
import { getImproveTextUseCase } from '@/infrastructure';
import { ValidationError, RateLimitError } from '@/application/errors/AppError';
import { toast } from 'sonner';

export interface ImproveTextParams {
  text: string;
  context: string;
}

/**
 * Hook to improve text using AI
 * @returns Mutation with improve function
 */
export const useImproveText = () => {
  return useMutation({
    mutationFn: async (params: ImproveTextParams) => {
      const useCase = getImproveTextUseCase();
      return useCase.execute(params);
    },
    onSuccess: () => {
      toast.success('Text improved successfully');
    },
    onError: (error: Error) => {
      if (error instanceof ValidationError) {
        toast.error(error.message);
      } else if (error instanceof RateLimitError) {
        toast.error('Too many requests. Please wait a moment.');
      } else {
        toast.error('Failed to improve text');
      }
    },
  });
};
