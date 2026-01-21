import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUserCVs } from '@/application/hooks/cv/useUserCVs';
import { mockSavedCV, createMockCVs } from '@/__tests__/mocks/repositories';

// Mock the DI container
vi.mock('@/infrastructure/di/container', () => ({
  getGetUserCVsUseCase: () => ({
    execute: vi.fn().mockResolvedValue({
      cvs: [mockSavedCV],
      total: 1,
    }),
  }),
}));

describe('useUserCVs', () => {
  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };

  it('should fetch user CVs successfully', async () => {
    const { result } = renderHook(() => useUserCVs(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.cvs).toHaveLength(1);
    expect(result.current.data?.total).toBe(1);
    expect(result.current.data?.cvs[0]).toEqual(mockSavedCV);
  });

  it('should handle loading state', () => {
    const { result } = renderHook(() => useUserCVs(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it('should handle empty CV list', async () => {
    const { getGetUserCVsUseCase } = await import('@/infrastructure/di/container');
    (getGetUserCVsUseCase as any).mockReturnValue({
      execute: vi.fn().mockResolvedValue({ cvs: [], total: 0 }),
    });

    const { result } = renderHook(() => useUserCVs(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.cvs).toHaveLength(0);
    expect(result.current.data?.total).toBe(0);
  });

  it('should provide refetch function', async () => {
    const { result } = renderHook(() => useUserCVs(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.refetch).toBeDefined();
    expect(typeof result.current.refetch).toBe('function');
  });
});
