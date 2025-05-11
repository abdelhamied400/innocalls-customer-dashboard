"use client";
import { DataTable } from "@/components/ui/data-table";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./columns";
import AutoDialerService from "@/services/auto-dialer.service";
import { useSearchParams } from "next/navigation";
import { useFilters } from "@/hooks/use-filters";

const ActiveCampaignsTable = () => {
  const filters = useSearchParams();
  const { updateFilter } = useFilters();
  const { data, isLoading, isRefetching } = useQuery({
    queryKey: [
      "auto-dialer-active-campaigns",
      filters.get("search") || "",
      filters.get("page") || 1,
    ],
    queryFn: async () =>
      await AutoDialerService.fetchActiveCampaigns({
        search: filters.get("search") || "",
        page: filters.get("page") || 1,
        limit: 1,
      }),
    refetchOnMount: "always",
  });

  return (
    <div className="auto-dialer-active-table">
      <DataTable
        columns={columns}
        data={data?.campaigns || []}
        isLoading={isLoading || isRefetching}
        pagination={{ perPage: 1 }}
        onPageChange={(updater) => {
          if (typeof updater === "function") {
            const newState = updater({
              pageIndex: 0,
              pageSize: 1,
            });
            updateFilter("page", newState.pageIndex + 1);
          } else {
            updateFilter("page", updater.pageIndex + 1);
          }
        }}
      />
    </div>
  );
};

export default ActiveCampaignsTable;
