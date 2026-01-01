import { QueryClient } from "@tanstack/react-query";

/**
 * Default query options for all React Query hooks
 */
export const defaultQueryOptions = {
  retry: 3,
  retryDelay: (attemptIndex: number) => Math.pow(2, attemptIndex) * 1000,
  staleTime: 1000 * 60 * 10, // 10 minutes
  gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
};

/**
 * Custom query client with default options and error logging
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      ...defaultQueryOptions,
      onError: (error: any) => {
        console.error("React Query Error:", {
          message: error?.message || "Unknown error",
          status: error?.status,
          url: error?.url,
          timestamp: new Date().toISOString(),
        });
      },
    },
  },
});

/**
 * Helper to create type-safe query options with defaults
 */
export const createQueryOptions = <TData = unknown, TError = Error>(
  options: UseQueryOptions<TData, TError>
): UseQueryOptions<TData, TError> => {
  return {
    ...defaultQueryOptions,
    ...options,
  };
};
