"use client";
import {
  Table as TanstackTable,
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { Table } from "../ui/table";
import { createContext, PropsWithChildren, useEffect, useState } from "react";

type DataTableContextType<TData, TValue> = {
  table: TanstackTable<TData>;
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
};

export const PaginatedTableContext = createContext<
  DataTableContextType<any, any> | undefined
>(undefined);

type PaginatedTableProps<TData, TValue> = PropsWithChildren<{
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  onPaginationChange?: (pagination: PaginationState) => void;
}>;
const PaginatedTable = <TData, TValue>({
  data,
  columns,
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
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // state
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
      <PaginatedTableContext value={{ table, data, columns }}>
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
