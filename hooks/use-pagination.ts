import {
  defaultPagesToShow,
  generatePagesArray,
  shouldAddPostEllipses,
  shouldAddPreEllipses,
} from "@/lib/pagination";
import { PaginationState } from "@tanstack/react-table";
import { useMemo, useState } from "react";

type UsePaginationProps<TData> = {
  data: TData[];
  pagination?: {
    perPage?: number;
  };
};
const usePagination = <TData>({
  data,
  pagination,
}: UsePaginationProps<TData>) => {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pagination?.perPage || 10,
  });

  const pages = useMemo(() => {
    const pagesCount = Math.ceil(data.length / pageSize);

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
  }, [data.length, pageIndex, pageSize]);

  return {
    pageIndex,
    pageSize,
    setPagination,
    pages,
  };
};

export default usePagination;
