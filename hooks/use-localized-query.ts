import useAuthStore from "@/store/auth.slice";
import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { useLocale } from "@/providers/TranslationProvider";

type QueryFn<T> = (context: { locale: string }) => Promise<T>;

// Overloaded function signatures to handle different patterns
export function useLocalizedQuery<T>(
  queryObject: {
    queryKey: (string | any)[];
    queryFn: () => Promise<T>;
  } & Omit<UseQueryOptions<T>, "queryKey" | "queryFn">
): UseQueryResult<T>;

export function useLocalizedQuery<T>(
  key: string,
  queryFn: QueryFn<T>,
  options?: UseQueryOptions<T>
): UseQueryResult<T>;

export function useLocalizedQuery<T>(
  keyOrObject:
    | string
    | ({
        queryKey: (string | any)[];
        queryFn: () => Promise<T>;
      } & Omit<UseQueryOptions<T>, "queryKey" | "queryFn">),
  queryFn?: QueryFn<T>,
  options?: UseQueryOptions<T>
): UseQueryResult<T> {
  const locale = useLocale();
  const { Organization } = useAuthStore();

  if (typeof keyOrObject === "string") {
    // Original pattern: useLocalizedQuery(key, queryFn, options)
    return useQuery({
      queryKey: [keyOrObject, locale, Organization?.id],
      queryFn: () => queryFn!({ locale }),
      ...options,
    });
  } else {
    // New pattern: useLocalizedQuery({ queryKey, queryFn, ...options })
    const { queryKey, queryFn: fn, ...opts } = keyOrObject;
    return useQuery({
      queryKey: [...queryKey, locale, Organization?.id],
      queryFn: fn,
      ...opts,
    });
  }
}
