"use client";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { useTranslations } from "@/providers/TranslationProvider";
import autoDialerService from "@/services/auto-dialer.service";
import { PaginationState } from "@tanstack/react-table";
import { isAxiosError } from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTable from "@/components/Table/PaginatedTable";
import { columns } from "./columns";
import CampaignCdrsHead from "./head";

const AutoDialerCampaignCdrsTable = () => {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations("autoDialer.campaignCdrs");

  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading, isError, error } = useLocalizedQuery({
    queryKey: ["auto-dialer-campaign-cdrs", id, filters, pagination],
    queryFn: async () =>
      await autoDialerService.fetchCampaignCdrs(id, {
        ...filters,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      }),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  useEffect(() => {
    if (isError) {
      if (isAxiosError(error)) {
        toast.error("Error", {
          description: error.response?.data?.message || "An error occurred",
        });
        return;
      }
      toast.error("Error", {
        description: "An error occurred",
      });
    }
  }, [isError, error]);

  const handleFiltersChange = (nextFilters: typeof filters) => {
    setFilters(nextFilters);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  return (
    <div className="rounded-lg flex-1 flex flex-col overflow-hidden">
      <PaginatedTable
        data={data?.callRequests || []}
        columns={columns(t)}
        pagination={{
          totalItems: data?.totalItems || 0,
          totalPages: data?.totalPages || 0,
        }}
        paginationState={pagination}
        onPaginationChange={setPagination}
      >
        <CampaignCdrsHead filters={filters} setFilters={handleFiltersChange} />
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

export default AutoDialerCampaignCdrsTable;
