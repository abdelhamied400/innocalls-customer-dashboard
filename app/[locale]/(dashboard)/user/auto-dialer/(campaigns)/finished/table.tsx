"use client";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { columns } from "./columns";
import AutoDialerService from "@/services/auto-dialer.service";
import PaginatedTable from "@/components/Table/PaginatedTable";
import AutoDialerFinishedHead from "./head";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import { useEffect, useState } from "react";
import { PaginationState } from "@tanstack/react-table";
import { useToast } from "@/hooks/use-toast";
import { isAxiosError } from "axios";

const FinishedCampaignsTable = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { data, isLoading, isError, error } = useLocalizedQuery({
    queryKey: ["auto-dialer-finished-campaigns", filters, pagination],
    queryFn: async () =>
      await AutoDialerService.fetchFinishedCampaigns({
        ...filters,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      }),
  });

  useEffect(() => {
    if (isError) {
      if (isAxiosError(error)) {
        toast({
          title: "Error",
          description: error.response?.data?.message || "An error occurred",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Error",
        description: "An error occurred",
        variant: "destructive",
      });
    }
  }, [isError, error, toast]);

  return (
    <div className="rounded-lg flex-1 flex flex-col overflow-hidden">
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
        <AutoDialerFinishedHead filters={filters} setFilters={setFilters} />
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

export default FinishedCampaignsTable;
