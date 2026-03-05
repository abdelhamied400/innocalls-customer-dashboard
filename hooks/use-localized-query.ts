import useAuthStore from "@/store/auth.slice";
import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { useLocale } from "@/providers/TranslationProvider";
import useAuth from "./useAuth";

type QueryFn<T> = (context: { locale: string }) => Promise<T>;

// Overloaded function signatures to handle different patterns
export function useLocalizedQuery<T>(
  queryObject: {
    queryKey: (string | any)[];
    queryFn: () => Promise<T>;
  } & Omit<UseQueryOptions<T>, "queryKey" | "queryFn">,
): UseQueryResult<T>;

export function useLocalizedQuery<T>(
  key: string,
  queryFn: QueryFn<T>,
  options?: UseQueryOptions<T>,
): UseQueryResult<T>;

export function useLocalizedQuery<T>(
  keyOrObject:
    | string
    | ({
        queryKey: (string | any)[];
        queryFn: () => Promise<T>;
      } & Omit<UseQueryOptions<T>, "queryKey" | "queryFn">),
  queryFn?: QueryFn<T>,
  options?: UseQueryOptions<T>,
): UseQueryResult<T> {
  const locale = useLocale();
  const { Organization } = useAuthStore();
  const { data: auth } = useAuth();

  const queryOptions = typeof keyOrObject === "string"
    ? {
        queryKey: [keyOrObject, locale, Organization?.id, auth?.user?.id],
        queryFn: () => queryFn!({ locale }),
        ...options,
      }
    : (() => {
        const { queryKey, queryFn: fn, ...opts } = keyOrObject;
        return {
          queryKey: [...queryKey, locale, Organization?.id, auth?.user?.id],
          queryFn: fn,
          ...opts,
        };
      })();

  return useQuery(queryOptions);
}
