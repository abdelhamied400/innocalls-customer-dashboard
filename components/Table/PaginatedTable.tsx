"use client";
import { TableMeta } from "@tanstack/react-table";
import {
  Table as TanstackTable,
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { createContext, PropsWithChildren, useEffect, useState } from "react";

type DataTableContextType<TData, TValue> = {
  table: TanstackTable<TData>;
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  pagination: PaginationState;
};

export const PaginatedTableContext = createContext<
  DataTableContextType<any, any> | undefined
>(undefined);

type PaginatedTableProps<TData, TValue> = PropsWithChildren<{
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  pagination?: {
    totalItems: number;
    totalPages: number;
  };
  onPaginationChange?: (pagination: PaginationState) => void;
  onSortingChange?: (sorting: SortingState) => void;
  manualPagination?: boolean;
  meta?: TableMeta<TData>;
}>;
const PaginatedTable = <TData, TValue>({
  data,
  columns,
  pagination: { totalItems, totalPages } = { totalItems: 0, totalPages: 0 },
  onPaginationChange,
  onSortingChange,
  manualPagination = true,
  children,
  meta,
}: PaginatedTableProps<TData, TValue>) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    // models
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // state
    state: {
      sorting,
      pagination,
      columnFilters,
    },
    // options
    manualPagination,
    ...(manualPagination && {
      pageCount: totalPages,
      rowCount: totalItems,
    }),
    // callbacks
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    meta,
  });

  //* watch pagination change
  useEffect(() => {
    onPaginationChange?.(pagination);
  }, [pagination]);

  // * watch sorting change
  useEffect(() => {
    onSortingChange?.(sorting);
  }, [sorting]);

  return (
    <div className="paginated-table flex-1 flex flex-col overflow-hidden">
      <PaginatedTableContext value={{ table, data, columns, pagination }}>
        {children}
      </PaginatedTableContext>
    </div>
  );
};

import { useContext } from "react";

export const usePaginatedTable = <TData, TValue>() => {
  const context = useContext(
    PaginatedTableContext as React.Context<
      DataTableContextType<TData, TValue> | undefined
    >
  );
  if (!context) {
    throw new Error("usePaginatedTable must be used within a PaginatedTable");
  }

  return context;
};

export default PaginatedTable;
