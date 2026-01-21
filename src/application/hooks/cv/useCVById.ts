import { useQuery } from '@tanstack/react-query';
import { getGetCVByIdUseCase } from '@/infrastructure';
import { queryKeys } from '../queries/queryKeys';

/**
 * Hook to fetch a single CV by ID
 * @param id - CV ID
 * @returns Query result with CV data
 */
export const useCVById = (id: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.cvs.detail(id ?? ''),
    queryFn: async () => {
      if (!id) return null;
      const useCase = getGetCVByIdUseCase();
      return useCase.execute({ id });
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
