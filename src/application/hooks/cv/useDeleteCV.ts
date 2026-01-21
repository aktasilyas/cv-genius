import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getDeleteCVUseCase } from '@/infrastructure';
import { queryKeys } from '../queries/queryKeys';
import { NotFoundError } from '@/application/errors/AppError';
import { toast } from 'sonner';

/**
 * Hook to delete a CV
 * @returns Mutation with delete function
 */
export const useDeleteCV = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const useCase = getDeleteCVUseCase();
      await useCase.execute({ id });
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cvs.lists() });
      queryClient.removeQueries({ queryKey: queryKeys.cvs.detail(id) });
      toast.success('CV deleted successfully');
    },
    onError: (error: Error) => {
      if (error instanceof NotFoundError) {
        toast.error('CV not found');
      } else {
        toast.error('Failed to delete CV');
      }
    },
  });
};
