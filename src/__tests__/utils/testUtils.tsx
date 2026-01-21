import { FC, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from '@/application/providers/AppProviders';

/**
 * Create a test QueryClient with disabled retry and caching
 */
export const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
      staleTime: 0,
    },
    mutations: {
      retry: false,
    },
  },
  logger: {
    log: () => {},
    warn: () => {},
    error: () => {},
  },
});

interface WrapperProps {
  children: ReactNode;
}

/**
 * Test wrapper with all providers
 * Use this for integration tests
 */
export const AllProviders: FC<WrapperProps> = ({ children }) => {
  const queryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppProviders>
          {children}
        </AppProviders>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

/**
 * Minimal test wrapper with only QueryClient
 * Use this for hook tests that don't need full context
 */
export const QueryWrapper: FC<WrapperProps> = ({ children }) => {
  const queryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

/**
 * Render component with all providers
 */
export const renderWithProviders = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options });

/**
 * Render component with only QueryClient
 */
export const renderWithQuery = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: QueryWrapper, ...options });

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { renderWithProviders as render };
