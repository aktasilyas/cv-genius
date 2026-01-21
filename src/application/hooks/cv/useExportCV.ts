import { useMutation } from '@tanstack/react-query';
import { getExportCVUseCase } from '@/infrastructure';
import { ValidationError, NotFoundError } from '@/application/errors/AppError';
import { toast } from 'sonner';

export interface ExportCVParams {
  id: string;
  format: 'pdf' | 'docx' | 'json';
}

/**
 * Hook to export a CV
 * @returns Mutation with export function
 */
export const useExportCV = () => {
  return useMutation({
    mutationFn: async (params: ExportCVParams) => {
      const useCase = getExportCVUseCase();
      return useCase.execute(params);
    },
    onSuccess: (data) => {
      toast.success(`CV ready for export as ${data.format.toUpperCase()}`);
      return data;
    },
    onError: (error: Error) => {
      if (error instanceof ValidationError) {
        toast.error('CV must be complete before exporting');
      } else if (error instanceof NotFoundError) {
        toast.error('CV not found');
      } else {
        toast.error('Failed to export CV');
      }
    },
  });
};
