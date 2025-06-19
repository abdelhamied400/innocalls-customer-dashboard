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
};
const usePagination = <TData,>(table: Table<TData>, options: Options) => {
  const tablePagination = table.getState().pagination;
  const startRowIndex =
    tablePagination.pageIndex * tablePagination.pageSize + 1;
  const endRowIndex = Math.min(
    (tablePagination.pageIndex + 1) * tablePagination.pageSize,
    table.getFilteredRowModel().rows.length
  );
  const totalItems = table.getFilteredRowModel().rows.length;

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
