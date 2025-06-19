"use client";
import {
  Table as TanstackTable,
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable,
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
}>;
const PaginatedTable = <TData, TValue>({
  data,
  columns,
  pagination: { totalItems, totalPages } = { totalItems: 0, totalPages: 0 },
  onPaginationChange,
  children,
}: PaginatedTableProps<TData, TValue>) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    // models
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // state
    pageCount: totalPages,
    rowCount: totalItems,
    state: {
      pagination,
    },
    // options
    manualPagination: true,
    // callbacks
    onPaginationChange: setPagination,
  });

  //* watch pagination change
  useEffect(() => {
    onPaginationChange?.(pagination);
  }, [pagination]);

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
