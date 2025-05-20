"use client";

import { PaginationState } from "@tanstack/react-table";
import dynamic from "next/dynamic";
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
  pagination?: PaginationState;
};

const NumbersTable = ({ data, pagination }: NumbersTableProps) => {
  const { updateFilters } = useFilters();

  return (
    <DataTableProvider
      data={data}
      columns={columns}
      pagination={{
        totalItems: data.length,
        perPage: pagination?.pageSize,
      }}
      onPaginationChange={(pagination) => {
        updateFilters(
          {
            page: String(pagination.pageIndex + 1),
            pageSize: String(pagination.pageSize),
          },
          {
            silent: true,
          }
        );
      }}
      defaultPageIndex={pagination?.pageIndex}
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
