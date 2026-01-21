import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getUpdateCVUseCase } from '@/infrastructure';
import { queryKeys } from '../queries/queryKeys';
import { CVData, CVTemplateType } from '@/domain';
import { ValidationError, NotFoundError } from '@/application/errors/AppError';
import { toast } from 'sonner';

export interface UpdateCVParams {
  id: string;
  title?: string;
  cvData?: CVData;
  selectedTemplate?: CVTemplateType;
}

/**
 * Hook to update an existing CV
 * @returns Mutation with update function
 */
export const useUpdateCV = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateCVParams) => {
      const useCase = getUpdateCVUseCase();
      return useCase.execute({ id, ...updates });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cvs.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.cvs.detail(variables.id) });
      toast.success('CV updated successfully');
      return data;
    },
    onError: (error: Error) => {
      if (error instanceof ValidationError) {
        toast.error(error.message);
      } else if (error instanceof NotFoundError) {
        toast.error('CV not found');
      } else {
        toast.error('Failed to update CV');
      }
    },
  });
};
