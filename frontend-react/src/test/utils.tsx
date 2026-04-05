import { PropsWithChildren, ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

type TestProviderProps = PropsWithChildren<{
  route?: string;
}>;

function TestProviders({ children, route = '/' }: TestProviderProps) {
  const queryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    </QueryClientProvider>
  );
}

type ExtendedRenderOptions = Omit<RenderOptions, 'wrapper'> & {
  route?: string;
};

export function renderWithProviders(
  ui: ReactElement,
  { route = '/', ...options }: ExtendedRenderOptions = {},
) {
  return render(ui, {
    wrapper: ({ children }) => <TestProviders route={route}>{children}</TestProviders>,
    ...options,
  });
}

export * from '@testing-library/react';
