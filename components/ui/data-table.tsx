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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Skeleton } from "./skeleton";

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
      <div className="">
        <Table>
          <TableHeader className="bg-gray-200">
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
              <>
                {Array(10)
                  .fill(0)
                  .map((_, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="p-0" colSpan={columns.length}>
                        <div className="place-items-center grid h-9">
                          <Skeleton className="rounded-none w-full h-full" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </>
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
      <div className="border-b h-2" />
      <div className="flex justify-between items-center gap-2 p-4">
        <div className="pagination">
          <Pagination className="justify-normal">
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

        <div className="flex items-center gap-2 per-page">
          <label className="text-sm">Rows per page:</label>
          <Select>
            <SelectTrigger className="w-max">
              <SelectValue placeholder="10" defaultValue="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="30">30</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm">
            {pageIndex * pageSize + 1}-
            {Math.min((pageIndex + 1) * pageSize, data.length)} of {data.length}
          </p>
        </div>
      </div>
    </div>
  );
}
