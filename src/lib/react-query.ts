import {
  QueryCache,
  QueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";

/**
 * Default query options for all React Query hooks
 */
export const defaultQueryOptions = {
  retry: 3,
  retryDelay: (attemptIndex: number) => Math.pow(2, attemptIndex) * 1000,
  staleTime: 1000 * 60 * 10, // 10 minutes
  gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
};

const queryCache = new QueryCache({
  onError: (error) => {
    const err = error as { message?: string; status?: number; url?: string } | unknown;
    console.error("React Query Error:", {
      message: (err as any)?.message || "Unknown error",
      status: (err as any)?.status,
      url: (err as any)?.url,
      timestamp: new Date().toISOString(),
    });
  },
});

/**
 * Custom query client with default options and error logging
 */
export const queryClient = new QueryClient({
  queryCache,
  defaultOptions: {
    queries: {
      ...defaultQueryOptions,
    },
  },
});

/**
 * Helper to create type-safe query options with defaults
 */
export const createQueryOptions = <TData = unknown, TError = Error>(
  options: UseQueryOptions<TData, TError>
) => ({
  ...defaultQueryOptions,
  ...options,
});
