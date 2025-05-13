"use client";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./columns";
import AutoDialerService from "@/services/auto-dialer.service";
import { useSearchParams } from "next/navigation";
import { useFilters } from "@/hooks/use-filters";
import DataTableProvider, {
  DataTable,
  DataTableBody,
  DataTableHeader,
  DataTablePagination,
  DataTableSkeleton,
} from "@/components/ui/new-data-table";

const ActiveCampaignsTable = () => {
  const filters = useSearchParams();
  const { updateFilters, getAllFilters } = useFilters();
  const perPage = parseInt(filters.get("perPage") || "10");

  const { data, isLoading } = useQuery({
    queryKey: ["auto-dialer-active-campaigns", getAllFilters()],
    queryFn: async () =>
      await AutoDialerService.fetchActiveCampaigns({
        ...getAllFilters(),
        limit: perPage,
      }),
    refetchOnMount: "always",
  });

  const { campaigns = [], ...pagination } = data || {};

  return (
    <DataTableProvider
      data={campaigns}
      columns={columns}
      pagination={{
        ...pagination,
        perPage,
      }}
      manualPagination
      onPaginationChange={({ pageSize, pageIndex }) => {
        updateFilters({
          page: pageIndex + 1,
          perPage: pageSize,
        });
      }}
    >
      <DataTable>
        <DataTableHeader />
        {isLoading && <DataTableSkeleton rows={3} />}
        {!isLoading && <DataTableBody />}
      </DataTable>

      {!isLoading && <DataTablePagination />}
    </DataTableProvider>
  );
};

export default ActiveCampaignsTable;
