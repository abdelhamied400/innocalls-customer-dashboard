"use client";
import { DataTable } from "@/components/ui/data-table";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./columns";
import queryFinishedAutoDialerCampaigns from "@/queries/useAutoDialerCampaigns";

const FinishedCampaignsTable = () => {
  const { data, isLoading } = useQuery(queryFinishedAutoDialerCampaigns({}));

  return (
    <div className="auto-dialer-finished-table">
      <DataTable
        columns={columns}
        data={data?.campaigns || []}
        isLoading={isLoading}
      />
    </div>
  );
};

export default FinishedCampaignsTable;
