import { useMutation } from '@tanstack/react-query';
import { getMatchJobUseCase } from '@/infrastructure';
import { CVData } from '@/domain';
import { ValidationError, RateLimitError } from '@/application/errors/AppError';
import { toast } from 'sonner';

export interface JobMatchParams {
  cvData: CVData;
  jobDescription: string;
}

/**
 * Hook to match CV against a job description
 * @returns Mutation with match function
 */
export const useJobMatch = () => {
  return useMutation({
    mutationFn: async (params: JobMatchParams) => {
      const useCase = getMatchJobUseCase();
      return useCase.execute(params);
    },
    onSuccess: (data) => {
      toast.success(`Match Score: ${data.match.score}%`);
      return data;
    },
    onError: (error: Error) => {
      if (error instanceof ValidationError) {
        toast.error(error.message);
      } else if (error instanceof RateLimitError) {
        toast.error('Too many requests. Please wait a moment.');
      } else {
        toast.error('Failed to match job');
      }
    },
  });
};
