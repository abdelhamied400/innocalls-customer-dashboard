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
  const { pageIndex, pageSize, setPagination, pages } = usePagination<TData>({
    data,
    pagination,
  });

  const table = useReactTable({
    data,
    columns,
    manualPagination,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: (props) => {
      setPagination(props);
      if (!!onPageChange) onPageChange(props);
    },
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
          <p className="text-sm">
            {pageIndex * pageSize + 1}-
            {Math.min((pageIndex + 1) * pageSize, data.length)} of {data.length}
          </p>
        </div>
      </div>
    </div>
  );
}
