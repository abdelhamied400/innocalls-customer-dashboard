"use client";
import { TableMeta } from "@tanstack/react-table";
import {
  Table as TanstackTable,
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
  PaginationState,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  ExpandedState,
  Row,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { createContext, PropsWithChildren, useEffect, useState } from "react";

type ServerPagination = {
  from?: number;
  to?: number;
  total?: number;
  limit?: number;
  hasNext?: boolean;
};

type DataTableContextType<TData, TValue> = {
  table: TanstackTable<TData>;
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  pagination: PaginationState;
  serverPagination?: ServerPagination;
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
    from?: number;
    to?: number;
  };
  paginationState?: PaginationState;
  onPaginationChange?: (pagination: PaginationState) => void;
  onSortingChange?: (sorting: SortingState) => void;
  manualPagination?: boolean;
  meta?: TableMeta<TData>;
  serverPagination?: ServerPagination;
  getRowCanExpand?: (row: Row<TData>) => boolean;
}>;
const PaginatedTable = <TData, TValue>({
  data,
  columns,
  pagination: { totalItems, totalPages, from, to } = {
    totalItems: 0,
    totalPages: 0,
  },
  paginationState: controlledPagination,
  onPaginationChange,
  onSortingChange,
  manualPagination = true,
  children,
  meta,
  serverPagination: serverPaginationProp,
  getRowCanExpand,
}: PaginatedTableProps<TData, TValue>) => {
  const [internalPagination, setInternalPagination] = useState<PaginationState>(
    {
      pageIndex: 0,
      pageSize: 10,
    },
  );

  const pagination = controlledPagination ?? internalPagination;
  const handlePaginationChange = (
    updaterOrValue:
      | PaginationState
      | ((old: PaginationState) => PaginationState),
  ) => {
    const newPagination =
      typeof updaterOrValue === "function"
        ? updaterOrValue(pagination)
        : updaterOrValue;

    if (controlledPagination) {
      // Controlled mode: let parent handle state
      onPaginationChange?.(newPagination);
    } else {
      // Uncontrolled mode: update internal state and notify parent
      setInternalPagination(newPagination);
      onPaginationChange?.(newPagination);
    }
  };
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const table = useReactTable({
    data,
    columns,
    // models
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    // state
    state: {
      sorting,
      pagination,
      columnFilters,
      expanded,
    },
    // options
    manualPagination,
    ...(manualPagination && {
      pageCount: totalPages,
      rowCount: totalItems,
    }),
    // callbacks
    onPaginationChange: handlePaginationChange,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onExpandedChange: setExpanded,
    getRowCanExpand,
    meta,
  });

  // * watch sorting change
  useEffect(() => {
    onSortingChange?.(sorting);
  }, [sorting]);

  // Sync table pagination when controlled pagination changes from parent
  useEffect(() => {
    if (controlledPagination) {
      table.setPageIndex(controlledPagination.pageIndex);
      table.setPageSize(controlledPagination.pageSize);
    }
  }, [controlledPagination?.pageIndex, controlledPagination?.pageSize]);

  // Build serverPagination object - prefer prop, fallback to from/to/total from pagination
  const serverPagination: ServerPagination | undefined = serverPaginationProp
    ? serverPaginationProp
    : manualPagination && from !== undefined && to !== undefined
      ? { from, to, total: totalItems }
      : undefined;

  return (
    <div className="paginated-table flex-1 flex flex-col overflow-hidden">
      <PaginatedTableContext
        value={{ table, data, columns, pagination, serverPagination }}
      >
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
    >,
  );
  if (!context) {
    throw new Error("usePaginatedTable must be used within a PaginatedTable");
  }

  return context;
};

export default PaginatedTable;
