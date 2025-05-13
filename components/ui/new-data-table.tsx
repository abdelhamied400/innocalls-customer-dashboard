"use client";
import { createContext, PropsWithChildren, use, useEffect } from "react";
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
import {
  Table as TanstackTable,
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
import usePagination from "@/hooks/use-pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DataTableContextType<TData, TValue> = {
  table: TanstackTable<TData>;
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  isLoading?: boolean;
  onPaginationChange?: (pagination: PaginationState) => void;
  meta?: TableMeta<TData> | undefined;
  pages: number[];
};
const DataTableContext = createContext<
  DataTableContextType<any, any> | undefined
>(undefined);

type DataTableProviderProps<TData, TValue> = PropsWithChildren<{
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  isLoading?: boolean;
  onPaginationChange?: (pagination: PaginationState) => void;
  meta?: TableMeta<TData> | undefined;
  manualPagination?: boolean;
  pagination?: {
    perPage?: number;
    totalPages?: number;
    totalItems?: number;
  };
}>;
const DataTableProvider = <TData, TValue>({
  children,
  data = [],
  columns,
  isLoading,
  onPaginationChange,
  meta,
  manualPagination,
  pagination,
}: DataTableProviderProps<TData, TValue>) => {
  const { pages, pageIndex, pageSize, setPagination } = usePagination({
    totalItems: pagination?.totalItems,
    perPage: pagination?.perPage,
  });

  const handlePaginationChange = (updater: Updater<PaginationState>) => {
    setPagination((prev) => {
      const newState = typeof updater === "function" ? updater(prev) : updater;

      if (onPaginationChange) {
        onPaginationChange(newState);
      }

      return {
        ...prev,
        pageIndex: newState.pageIndex,
        pageSize: newState.pageSize,
      };
    });
  };

  const table = useReactTable({
    data,
    columns,
    debugTable: process.env.NODE_ENV === "development",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // pagination
    manualPagination,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: handlePaginationChange,
    pageCount: pagination?.totalPages,
    rowCount: pagination?.totalItems,
    // state
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    // meta
    meta,
  });

  return (
    <DataTableContext
      value={{
        table,
        data,
        columns,
        isLoading,
        meta,
        onPaginationChange,
        pages,
      }}
    >
      {children}
    </DataTableContext>
  );
};

type DataTableProps = PropsWithChildren<{}>;
export const DataTable = ({ children }: DataTableProps) => {
  return (
    <div className="data-table">
      <div className="">
        <Table>{children}</Table>
      </div>
    </div>
  );
};

export const DataTableHeader = () => {
  const { table } = useDataTable();
  return (
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
  );
};

export const DataTableBody = () => {
  const { table, columns } = useDataTable();
  return (
    <TableBody>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <TableRow
            key={row.id}
            data-state={row.getIsSelected() && "selected"}
            className="h-14"
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            No results.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};

type DataTableSkeletonProps = {
  rows?: number;
};
export const DataTableSkeleton = ({ rows = 5 }: DataTableSkeletonProps) => {
  const { columns } = useDataTable();

  return (
    <TableBody>
      {[...Array(rows)].map((_, rIdx) => (
        <TableRow key={`loading-${rIdx}`} className="h-14">
          {[...Array(columns.length)].map((_, cIdx) => (
            <TableCell key={`loading-${cIdx}`} className="h-10">
              <Skeleton className="w-full h-10" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
};

export const DataTablePagination = () => {
  const { table, pages } = useDataTable();

  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const pageIndexStart = pageIndex * pageSize + 1;
  const pageIndexEnd = Math.min(
    (pageIndex + 1) * pageSize,
    table.getRowCount()
  );

  return (
    <div className="flex items-center justify-between p-4">
      <Pagination className="">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            />
          </PaginationItem>
          {pages.map((page, idx) =>
            page === -1 ? (
              <PaginationItem key={`pagination-elipses-${idx}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={`pagination-${page}-${idx}`}>
                <PaginationButton
                  isActive={table.getState().pagination.pageIndex === idx}
                  onClick={() => table.setPageIndex(idx)}
                >
                  {page}
                </PaginationButton>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <div className="flex items-center gap-2">
        <span>Rows per page</span>
        <Select
          value={pageSize.toString()}
          defaultValue="10"
          onValueChange={(pageSize) => {
            table.setPageSize(parseInt(pageSize));
          }}
        >
          <SelectTrigger className="w-max">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>

        <span>
          {pageIndexStart} - {pageIndexEnd} of {table.getRowCount()}
        </span>
      </div>
    </div>
  );
};

export const useDataTable = () => {
  const context = DataTableContext;
  if (!context) {
    throw new Error("useDataTable must be used within a DataTableProvider");
  }
  const data = use(context);
  if (!data) {
    throw new Error("useDataTable must be used within a DataTableProvider");
  }
  return data;
};

export default DataTableProvider;
