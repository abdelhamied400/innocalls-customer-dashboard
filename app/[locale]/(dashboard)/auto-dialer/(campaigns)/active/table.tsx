"use client";
import { DataTable } from "@/components/ui/data-table";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./columns";
import queryActiveAutoDialerCampaigns from "@/queries/useAutoDialerCampaigns";

const ActiveCampaignsTable = () => {
  const { data, isLoading } = useQuery(queryActiveAutoDialerCampaigns({}));

  return (
    <div className="auto-dialer-active-table">
      <DataTable
        columns={columns}
        data={data?.campaigns || []}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ActiveCampaignsTable;
