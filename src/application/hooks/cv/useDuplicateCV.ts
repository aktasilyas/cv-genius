import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getDuplicateCVUseCase } from '@/infrastructure';
import { queryKeys } from '../queries/queryKeys';
import { NotFoundError } from '@/application/errors/AppError';
import { toast } from 'sonner';

/**
 * Hook to duplicate a CV
 * @returns Mutation with duplicate function
 */
export const useDuplicateCV = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const useCase = getDuplicateCVUseCase();
      return useCase.execute({ id });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cvs.lists() });
      toast.success(`CV duplicated: ${data.cv.title}`);
      return data;
    },
    onError: (error: Error) => {
      if (error instanceof NotFoundError) {
        toast.error('CV not found');
      } else {
        toast.error('Failed to duplicate CV');
      }
    },
  });
};
