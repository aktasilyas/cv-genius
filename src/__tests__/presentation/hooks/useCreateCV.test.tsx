import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCreateCV } from '@/application/hooks/cv/useCreateCV';
import { mockSavedCV } from '@/__tests__/mocks/repositories';
import { initialCVData } from '@/domain/entities/CVData';

// Mock the DI container
vi.mock('@/infrastructure/di/container', () => ({
  getCreateCVUseCase: () => ({
    execute: vi.fn().mockResolvedValue({ cv: mockSavedCV }),
  }),
}));

describe('useCreateCV', () => {
  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        mutations: { retry: false },
      },
    });

    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };

  it('should create CV successfully', async () => {
    const { result } = renderHook(() => useCreateCV(), {
      wrapper: createWrapper(),
    });

    const input = {
      title: 'New CV',
      cvData: initialCVData,
      template: 'modern' as const,
    };

    act(() => {
      result.current.mutate(input);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.cv).toEqual(mockSavedCV);
  });

  it('should handle mutation loading state', async () => {
    const { result } = renderHook(() => useCreateCV(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isPending).toBe(false);

    act(() => {
      result.current.mutate({
        title: 'Test',
        cvData: initialCVData,
        template: 'modern',
      });
    });

    expect(result.current.isPending).toBe(true);

    await waitFor(() => expect(result.current.isPending).toBe(false));
  });

  it('should call onSuccess callback', async () => {
    const { result } = renderHook(() => useCreateCV(), {
      wrapper: createWrapper(),
    });

    const onSuccess = vi.fn();

    act(() => {
      result.current.mutate(
        {
          title: 'Test',
          cvData: initialCVData,
          template: 'modern',
        },
        { onSuccess }
      );
    });

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
  });

  it('should provide mutateAsync method', async () => {
    const { result } = renderHook(() => useCreateCV(), {
      wrapper: createWrapper(),
    });

    const input = {
      title: 'Async Test',
      cvData: initialCVData,
      template: 'classic' as const,
    };

    const promise = act(() => result.current.mutateAsync(input));

    await expect(promise).resolves.toEqual({ cv: mockSavedCV });
  });
});
