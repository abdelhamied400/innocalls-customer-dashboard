import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { debounce } from "@/lib/debounce";

export const useFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const getFilter = useCallback(
    (key: string): string => {
      return searchParams.get(key) ?? "";
    },
    [searchParams]
  );

  const updateFilter = useCallback(
    debounce((key: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`?${params.toString()}`);
    }, 0),
    [searchParams, router]
  );

  const updateFilters = useCallback(
    debounce((updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams);

      Object.entries(updates).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      router.push(`?${params.toString()}`);
    }, 100),
    [searchParams, router]
  );

  const getFilterGroupKeys = useCallback((): Record<string, string[]> => {
    const groups: Record<string, string[]> = {};

    Array.from(searchParams.entries()).forEach(([key, value]) => {
      if (!value) return;
      const group = key.includes(".") ? key.split(".")[0] : key;
      if (!groups[group]) groups[group] = [];
      groups[group].push(key);
    });

    return groups;
  }, [searchParams]);

  const getFilterCountForGroup = useCallback(
    (group: string): number => {
      const all = getFilterGroupKeys();
      return all[group]?.length ?? 0;
    },
    [getFilterGroupKeys]
  );

  const clearGroup = useCallback(
    (group: string) => {
      const params = new URLSearchParams(searchParams);
      const groupKeys = getFilterGroupKeys()[group] ?? [];

      groupKeys.forEach((key) => {
        params.delete(key);
      });

      router.push(`?${params.toString()}`);
    },
    [searchParams, router, getFilterGroupKeys]
  );

  const clearAllFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    Array.from(params.keys()).forEach((key) => {
      params.delete(key);
    });
    router.push(`?${params.toString()}`);
  }, [searchParams, router]);

  const getAllFilters = useCallback((): Record<string, string> => {
    const result: Record<string, string> = {};
    Array.from(searchParams.entries()).forEach(([key, value]) => {
      if (value) result[key] = value;
    });
    return result;
  }, [searchParams]);

  const getActiveGroups = useCallback((): string[] => {
    return Object.keys(getFilterGroupKeys());
  }, [getFilterGroupKeys]);

  return {
    getFilter,
    updateFilter,
    updateFilters,
    getFilterGroupKeys,
    getFilterCountForGroup,
    clearGroup,
    getAllFilters,
    clearAllFilters,
    getActiveGroups,
  };
};
