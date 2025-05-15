import {
  defaultPagesToShow,
  generatePagesArray,
  shouldAddPostEllipses,
  shouldAddPreEllipses,
} from "@/lib/pagination";
import { PaginationState } from "@tanstack/react-table";
import { useMemo, useState } from "react";

type UsePaginationProps<TData> = {
  totalItems?: number;
  perPage?: number;
  defaultPageIndex?: number;
};
const usePagination = <TData>({
  totalItems = 0,
  perPage = 10,
  defaultPageIndex = 0,
}: UsePaginationProps<TData>) => {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: defaultPageIndex,
    pageSize: perPage,
  });

  const pages = useMemo(() => {
    const pagesCount = Math.ceil(totalItems / pageSize);

    let pages = [];

    // If there are fewer pages than or equal to the total pages to show
    if (pagesCount <= defaultPagesToShow + 2) {
      return [...Array(pagesCount)].map((_, idx) => idx + 1);
    }

    // Add first two pages
    pages = [1, 2];

    // add pre ellipses
    if (shouldAddPreEllipses(pageIndex)) {
      pages = [...pages, -1];
    }

    // Generate pages in the middle
    const middlePages = generatePagesArray(pageIndex, pagesCount);
    pages = [...pages, ...middlePages];

    // add post ellipses
    if (shouldAddPostEllipses(pageIndex, pagesCount)) {
      pages = [...pages, -1];
    }

    // add last two pages
    pages = [...pages, pagesCount - 1, pagesCount];

    return pages;
  }, [totalItems, pageIndex, pageSize]);

  return {
    pageIndex,
    pageSize,
    setPagination,
    pages,
  };
};

export default usePagination;
