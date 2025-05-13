"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  OnChangeFn,
  PaginationState,
  TableMeta,
  Updater,
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
import {
  Pagination,
  PaginationButton,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";
import { Skeleton } from "./skeleton";
import usePagination from "@/hooks/use-pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  onPageChange?: OnChangeFn<PaginationState>;
  pagination?: {
    pageIndex?: number;
    totalPages?: number;
    totalItems?: number;
    perPage?: number;
  };
  meta?: TableMeta<TData> | undefined;
}

export function DataTable<TData, TValue>({
  columns,
  data = [],
  isLoading,
  pagination,
  onPageChange,
  meta,
}: DataTableProps<TData, TValue>) {
  const manualPagination = !!onPageChange;

  const table = useReactTable({
    data,
    columns,
    manualPagination,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: onPageChange,
    state: {
      pagination: {
        pageIndex: pagination?.pageIndex || 0,
        pageSize: pagination?.perPage || 10,
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
                {[...Array(10)].map((_, rIdx) => (
                  <TableRow key={`loading-${rIdx}`} className="h-14">
                    {columns.map((column, cIdx) => (
                      <TableCell key={`${column.id}-${cIdx}`} className="h-10">
                        {column.id}
                        <Skeleton className="w-full h-10" />
                      </TableCell>
                    ))}
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
                      className="h-14"
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

              {[...Array(pagination?.totalPages)].map((_, idx) => (
                <PaginationItem key={`page-${idx}`}>
                  <PaginationButton
                    isActive={pagination?.pageIndex === idx}
                    onClick={() => table.setPageIndex(idx)}
                  >
                    {idx + 1}
                  </PaginationButton>
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
          {/* <Select>
            <SelectTrigger className="w-max">
              <SelectValue placeholder="10" defaultValue="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="30">30</SelectItem>
            </SelectContent>
          </Select> */}
          {/* <p className="text-sm">
            {pagination?.pageIndex * pageSize + 1}-
            {Math.min((pagination?.pageIndex + 1) * pageSize, data.length)} of {data.length}
          </p> */}
        </div>
      </div>
    </div>
  );
}
