import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCreateCVUseCase } from '@/infrastructure';
import { queryKeys } from '../queries/queryKeys';
import { CVData, CVTemplateType } from '@/domain';
import { ValidationError } from '@/application/errors/AppError';
import { toast } from 'sonner';

export interface CreateCVParams {
  title: string;
  cvData: CVData;
  template: CVTemplateType;
}

/**
 * Hook to create a new CV
 * @returns Mutation with create function
 */
export const useCreateCV = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateCVParams) => {
      const useCase = getCreateCVUseCase();
      return useCase.execute(params);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cvs.lists() });
      toast.success('CV created successfully');
      return data;
    },
    onError: (error: Error) => {
      if (error instanceof ValidationError) {
        toast.error(error.message);
        // Show field-specific errors if available
        if (error.fields) {
          Object.entries(error.fields).forEach(([field, message]) => {
            toast.error(`${field}: ${message}`);
          });
        }
      } else {
        toast.error('Failed to create CV');
      }
    },
  });
};
