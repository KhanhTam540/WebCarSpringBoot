import { PropsWithChildren, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

function shouldRetryTransientStartupError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  return /(?:HTTP\s)?(502|503|504)\b/.test(error.message);
}

export function AppProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => failureCount < 3 && shouldRetryTransientStartupError(error),
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
          },
          mutations: {
            retry: (failureCount, error) => failureCount < 2 && shouldRetryTransientStartupError(error),
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
}
