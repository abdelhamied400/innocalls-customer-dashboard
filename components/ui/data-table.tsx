"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  TableMeta,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import Spinner from "./spinner";
import { useMemo, useState } from "react";
import {
  Pagination,
  PaginationButton,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";
import {
  defaultPagesToShow,
  generatePagesArray,
  shouldAddPostEllipses,
  shouldAddPreEllipses,
} from "@/lib/pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  pagination?: {
    perPage?: number;
  };
  meta?: TableMeta<TData> | undefined;
}

export function DataTable<TData, TValue>({
  columns,
  data = [],
  isLoading,
  pagination,
  meta,
}: DataTableProps<TData, TValue>) {
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

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    meta,
  });

  return (
    <div className="data-table">
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell className="p-8" colSpan={columns.length}>
                  <div className="place-items-center grid">
                    <Spinner />
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!isLoading && (
              <>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="h-2" />
      <div className="flex items-center gap-2">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              />
            </PaginationItem>

            {pages.map((page, idx) => (
              <PaginationItem key={`page-${page}, ${idx}`}>
                {page === -1 && <PaginationEllipsis />}
                {page !== -1 && (
                  <PaginationButton
                    isActive={pageIndex === page - 1}
                    onClick={() => table.setPageIndex(page - 1)}
                  >
                    {page}
                  </PaginationButton>
                )}
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
