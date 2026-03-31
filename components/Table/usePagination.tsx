import {
  defaultPagesToShow,
  generatePagesArray,
  shouldAddPostEllipses,
  shouldAddPreEllipses,
} from "@/lib/pagination";
import { Table } from "@tanstack/react-table";
import { useMemo } from "react";

type ServerPagination = {
  from?: number;
  to?: number;
  total?: number;
  limit?: number;
  hasNext?: boolean;
};

type Options = {
  isManualPagination?: boolean;
  serverPagination?: ServerPagination;
};

const usePagination = <TData,>(table: Table<TData>, options: Options) => {
  const tablePagination = table.getState().pagination;
  const serverPagination = options.serverPagination;

  // Determine page size from server limit or table state
  const pageSize = serverPagination?.limit ?? tablePagination.pageSize;

  // Get the current page's row count
  const currentPageRowCount = table.getRowModel().rows.length;

  // Check if we're in "hasNext mode" (no total provided, using hasNext instead)
  const isHasNextMode =
    serverPagination?.hasNext !== undefined &&
    serverPagination?.total === undefined;

  // Use server-provided total, or calculate it from table's row count
  // In hasNext mode without total, we don't know the real total
  const totalItems = serverPagination?.total ?? table.getRowCount();

  // Calculate row indices based on current page
  const calculatedStart = tablePagination.pageIndex * pageSize + 1;
  const calculatedEnd =
    tablePagination.pageIndex * pageSize + currentPageRowCount;

  const startRowIndex =
    serverPagination?.from ?? (currentPageRowCount > 0 ? calculatedStart : 0);

  const endRowIndex =
    serverPagination?.to ?? (currentPageRowCount > 0 ? calculatedEnd : 0);

  // Determine if there's a next page
  const hasNextPage =
    serverPagination?.hasNext ??
    tablePagination.pageIndex + 1 < Math.ceil(totalItems / pageSize);

  // In hasNext mode, we don't show total (it's unknown)
  const showTotal = !isHasNextMode;

  const pages = useMemo(() => {
    const pagesCount = options.isManualPagination
      ? table.getPageCount()
      : Math.ceil(totalItems / pageSize);

    let pages = [];

    // If there are fewer pages than or equal to the total pages to show
    if (pagesCount <= defaultPagesToShow + 2) {
      return [...Array(pagesCount)].map((_, idx) => idx + 1);
    }

    // Add first two pages
    pages = [1, 2];

    // add pre ellipses
    if (shouldAddPreEllipses(tablePagination.pageIndex)) {
      pages = [...pages, -1];
    }

    // Generate pages in the middle
    const middlePages = generatePagesArray(
      tablePagination.pageIndex,
      pagesCount,
    );
    pages = [...pages, ...middlePages];

    // add post ellipses
    if (shouldAddPostEllipses(tablePagination.pageIndex, pagesCount)) {
      pages = [...pages, -1];
    }

    // add last two pages
    pages = [...pages, pagesCount - 1, pagesCount];

    return pages;
  }, [totalItems, tablePagination.pageIndex, pageSize, table.getPageCount()]);

  return {
    startRowIndex,
    endRowIndex,
    totalItems,
    pages,
    pageSize,
    hasNextPage,
    showTotal,
  };
};

export default usePagination;
