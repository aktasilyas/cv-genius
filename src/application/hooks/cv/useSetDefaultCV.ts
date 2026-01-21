import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getSetDefaultCVUseCase } from '@/infrastructure';
import { queryKeys } from '../queries/queryKeys';
import { NotFoundError } from '@/application/errors/AppError';
import { toast } from 'sonner';

/**
 * Hook to set a CV as default
 * @returns Mutation with setDefault function
 */
export const useSetDefaultCV = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const useCase = getSetDefaultCVUseCase();
      await useCase.execute({ id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cvs.lists() });
      toast.success('Default CV updated');
    },
    onError: (error: Error) => {
      if (error instanceof NotFoundError) {
        toast.error('CV not found');
      } else {
        toast.error('Failed to set default CV');
      }
    },
  });
};
