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
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = typeof (error as { status?: unknown })?.status === "number"
      ? (error as { status: number }).status
      : undefined;
    const url = typeof (error as { url?: unknown })?.url === "string"
      ? (error as { url: string }).url
      : undefined;

    console.error("React Query Error:", {
      message,
      status,
      url,
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
