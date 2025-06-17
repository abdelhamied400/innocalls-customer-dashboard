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

const ActiveCampaignsTable = () => {
  const filters = useSearchParams();
  const { updateFilters, getAllFilters } = useFilters();
  const perPage = parseInt(filters.get("perPage") || "10");
  const pageIndex = parseInt(filters.get("page") || "1") - 1;

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
    <div className="rounded-lg flex-1 flex flex-col overflow-hidden">
      <AutoDialerActiveHead />
      <PaginatedTable data={campaigns} columns={columns}>
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
