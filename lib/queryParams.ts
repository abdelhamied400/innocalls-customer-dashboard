import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { format } from "date-fns";

const formatDate = (date: Date) => format(date, "yyyy-MM-dd");
export const objectToQueryString = (obj: Record<string, any>) => {
  const params = new URLSearchParams();
  for (const key in obj) {
    const value = obj[key];
    if (!value) continue;

    if (Array.isArray(value)) {
      // If the value is an array, append each value with the same key
      value.forEach((v) => params.append(key, v));
    } else if (value instanceof Date) {
      // If the value is a Date object, format it and append
      params.append(key, formatDate(value));
    } else if (typeof value === "object") {
      // If the value is an object, append each sub-key with the same key
      for (const subKey in value) {
        params.append(`${key}[${subKey}]`, value[subKey]);
      }
    } else {
      params.append(key, value);
    }
  }

  return params.toString();
};

type TableSearchParams = {
  page?: string;
  pageSize?: string;
  [key: string]: string | undefined;
};
type TableInitialParams = {
  page?: string;
  pageSize?: string;
  filters: ColumnFiltersState;
  sorting: SortingState;
};
export const parseTableInitialParams = async (
  searchParams: Promise<TableSearchParams>
): Promise<TableInitialParams> => {
  const params = await searchParams;
  const { page = "1", pageSize = "10", ...otherParams } = params;
  // other params will be filters and sorts
  // sorts will start with sort_ and filters will be the rest
  const filters: ColumnFiltersState = [];
  const sorting: SortingState = [];
  Object.entries(otherParams).forEach(([key, value]) => {
    if (key.startsWith("sort_")) {
      const sortKey = key.replace("sort_", "");
      sorting.push({
        id: sortKey,
        desc: value === "desc",
      });
    } else {
      filters.push({
        id: key,
        value: value || "",
      });
    }
  });

  return {
    page: String(page),
    pageSize: String(pageSize),
    filters,
    sorting,
  };
};
