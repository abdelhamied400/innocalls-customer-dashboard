import {
  defaultPagesToShow,
  generatePagesArray,
  shouldAddPostEllipses,
  shouldAddPreEllipses,
} from "@/lib/pagination";
import { Table } from "@tanstack/react-table";
import { useMemo } from "react";

type Options = {
  isManualPagination?: boolean;
  serverPagination?: {
    from: number;
    to: number;
    total: number;
  };
};
const usePagination = <TData,>(table: Table<TData>, options: Options) => {
  const tablePagination = table.getState().pagination;

  // Use server-provided values when available, otherwise calculate
  const totalItems =
    options.serverPagination?.total ??
    (options.isManualPagination
      ? table.getRowCount()
      : table.getFilteredRowModel().rows.length);

  const startRowIndex =
    options.serverPagination?.from ??
    tablePagination.pageIndex * tablePagination.pageSize + 1;

  const endRowIndex =
    options.serverPagination?.to ??
    Math.min(
      (tablePagination.pageIndex + 1) * tablePagination.pageSize,
      totalItems
    );

  const pages = useMemo(() => {
    const pagesCount = options.isManualPagination
      ? table.getPageCount()
      : Math.ceil(totalItems / tablePagination.pageSize);

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
      pagesCount
    );
    pages = [...pages, ...middlePages];

    // add post ellipses
    if (shouldAddPostEllipses(tablePagination.pageIndex, pagesCount)) {
      pages = [...pages, -1];
    }

    // add last two pages
    pages = [...pages, pagesCount - 1, pagesCount];

    return pages;
  }, [
    totalItems,
    tablePagination.pageIndex,
    tablePagination.pageSize,
    table.getPageCount(),
  ]);

  return {
    startRowIndex,
    endRowIndex,
    totalItems,
    pages,
  };
};

export default usePagination;
