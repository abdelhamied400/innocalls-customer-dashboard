"use client";

import { PaginationState } from "@tanstack/react-table";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { columns, Number } from "./columns";
import DataTableProvider, {
  DataTable,
  DataTableBody,
  DataTableHeader,
} from "@/components/ui/data-table";
import DataTablePagination from "@/components/ui/data-table-pagination";
import { useFilters } from "@/hooks/use-filters";

type NumbersTableProps = {
  data: Number[];
  initialPagination?: PaginationState;
};
const NumbersTable = ({
  data,
  initialPagination = {
    pageIndex: 0,
    pageSize: 10,
  },
}: NumbersTableProps) => {
  const { isPending, updateFilters } = useFilters();

  const [pagination, setPagination] =
    useState<PaginationState>(initialPagination);

  useEffect(() => {
    updateFilters({
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
    });
  }, [pagination]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-full">
        Client Loading...
      </div>
    );
  }

  return (
    <DataTableProvider
      data={data}
      columns={columns}
      pagination={{
        totalItems: data.length,
        perPage: pagination.pageSize,
      }}
      onPaginationChange={setPagination}
      defaultPageIndex={pagination.pageIndex}
    >
      <DataTable>
        <DataTableHeader />
        <DataTableBody />
      </DataTable>

      <DataTablePagination />
    </DataTableProvider>
  );
};

export default dynamic(() => Promise.resolve(NumbersTable), {
  ssr: false,
});
