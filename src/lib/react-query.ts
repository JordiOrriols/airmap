import { QueryCache, QueryClient, type UseQueryOptions } from "@tanstack/react-query";

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
  onError: (error: unknown) => {
    let message = "Unknown error";
    let status: number | undefined;
    let url: string | undefined;

    if (error instanceof Error) {
      message = error.message;
    }

    const errorObj = error as Record<string, unknown>;
    if (typeof errorObj["status"] === "number") {
      status = errorObj["status"];
    }
    if (typeof errorObj["url"] === "string") {
      url = errorObj["url"];
    }

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
