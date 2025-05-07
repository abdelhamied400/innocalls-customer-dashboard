"use client";
import { DataTable } from "@/components/ui/data-table";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./columns";
import { useSearchParams } from "next/navigation";
import AutoDialerService from "@/services/auto-dialer.service";

const FinishedCampaignsTable = () => {
  const filters = useSearchParams();
  const { data, isLoading, isRefetching } = useQuery({
    queryKey: [
      "auto-dialer-active-campaigns",
      {
        search: filters.get("search") || "",
      },
    ],
    queryFn: async () =>
      await AutoDialerService.fetchActiveCampaigns({
        search: filters.get("search") || "",
      }),
    refetchOnMount: "always",
  });
  return (
    <div className="auto-dialer-finished-table">
      <DataTable
        columns={columns}
        data={data?.campaigns || []}
        isLoading={isLoading || isRefetching}
      />
    </div>
  );
};

export default FinishedCampaignsTable;
