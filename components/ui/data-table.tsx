"use client";
import {
  createContext,
  PropsWithChildren,
  use,
  useEffect,
  useLayoutEffect,
} from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { Skeleton } from "./skeleton";
import {
  Table as TanstackTable,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  TableMeta,
  Updater,
  useReactTable,
} from "@tanstack/react-table";
import usePagination from "@/hooks/use-pagination";

type DataTableContextType<TData, TValue> = {
  table: TanstackTable<TData>;
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  isLoading?: boolean;
  onPaginationChange?: (pagination: PaginationState) => void;
  meta?: TableMeta<TData> | undefined;
  pages: number[];
  pagination: {
    pageIndex: number;
    pageSize: number;
    totalItems?: number;
    totalPages?: number;
  };
  manualPagination?: boolean;
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
  defaultPageIndex?: number;
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
  defaultPageIndex = 0,
}: DataTableProviderProps<TData, TValue>) => {
  const { pages, pageIndex, pageSize, setPagination } = usePagination({
    totalItems: pagination?.totalItems,
    perPage: pagination?.perPage,
    defaultPageIndex: defaultPageIndex,
  });

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
    onPaginationChange: setPagination,
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

  useLayoutEffect(() => {
    if (onPaginationChange) {
      onPaginationChange({ pageIndex, pageSize });
    }
  }, [pageIndex, pageSize]);

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
        pagination: {
          pageIndex,
          pageSize,
          totalItems: pagination?.totalItems,
          totalPages: pagination?.totalPages,
        },
        manualPagination,
      }}
    >
      {children}
    </DataTableContext>
  );
};

type DataTableProps = PropsWithChildren<object>;
export const DataTable = ({ children }: DataTableProps) => {
  return <Table className="">{children}</Table>;
};

export const DataTableHeader = () => {
  const { table } = useDataTable();
  return (
    <TableHeader className="bg-gray-200 sticky -top-2 z-10">
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
    <TableBody className="">
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
