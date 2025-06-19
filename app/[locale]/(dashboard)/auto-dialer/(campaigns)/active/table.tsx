"use client";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./columns";
import AutoDialerService from "@/services/auto-dialer.service";
import { useSearchParams } from "next/navigation";
import { useFilters } from "@/hooks/use-filters";
import PaginatedTable from "@/components/Table/PaginatedTable";
import AutoDialerActiveHead from "./head";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import { useState } from "react";
import { PaginationState } from "@tanstack/react-table";

const ActiveCampaignsTable = () => {
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { data, isLoading } = useQuery({
    queryKey: [
      "auto-dialer-active-campaigns",
      JSON.stringify(filters),
      pagination,
    ],
    queryFn: async () =>
      await AutoDialerService.fetchActiveCampaigns({
        ...filters,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      }),
  });

  return (
    <div className="rounded-lg flex-1 flex flex-col overflow-hidden">
      <AutoDialerActiveHead filters={filters} setFilters={setFilters} />
      <PaginatedTable
        data={data?.campaigns || []}
        columns={columns}
        pagination={{
          totalItems: data?.totalItems || 0,
          totalPages: data?.totalPages || 0,
        }}
        onPaginationChange={(pagination) => {
          setPagination(pagination);
        }}
      >
        <PaginatedTableContent>
          <PaginatedTableHead />
          {isLoading && <PaginatedTableSkeleton />}
          {!isLoading && <PaginatedTableBody />}
        </PaginatedTableContent>
        {!isLoading && <PaginatedTablePagination />}
      </PaginatedTable>
    </div>
  );
};

export default ActiveCampaignsTable;
