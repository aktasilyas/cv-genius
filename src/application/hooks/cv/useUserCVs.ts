import { useQuery } from '@tanstack/react-query';
import { getGetUserCVsUseCase } from '@/infrastructure';
import { queryKeys } from '../queries/queryKeys';

/**
 * Hook to fetch all CVs for the current user
 * @returns Query result with cvs array and total count
 */
export const useUserCVs = () => {
  return useQuery({
    queryKey: queryKeys.cvs.lists(),
    queryFn: async () => {
      const useCase = getGetUserCVsUseCase();
      return useCase.execute();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
