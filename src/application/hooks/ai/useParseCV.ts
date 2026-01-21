import { useMutation } from '@tanstack/react-query';
import { getParseCVTextUseCase } from '@/infrastructure';
import { ValidationError, RateLimitError } from '@/application/errors/AppError';
import { toast } from 'sonner';

export interface ParseCVParams {
  text: string;
}

/**
 * Hook to parse CV text (LinkedIn, resume text, etc.)
 * @returns Mutation with parse function
 */
export const useParseCV = () => {
  return useMutation({
    mutationFn: async (params: ParseCVParams) => {
      const useCase = getParseCVTextUseCase();
      return useCase.execute(params);
    },
    onSuccess: (data) => {
      toast.success('CV data extracted successfully');
      return data;
    },
    onError: (error: Error) => {
      if (error instanceof ValidationError) {
        toast.error(error.message);
      } else if (error instanceof RateLimitError) {
        toast.error('Too many requests. Please wait a moment.');
      } else {
        toast.error('Failed to parse CV text');
      }
    },
  });
};
