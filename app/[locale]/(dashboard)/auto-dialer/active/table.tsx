"use client";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import AutoDialerActiveHead from "./head";
import useAutoDialerCampaigns from "@/queries/useAutoDialerCampaigns";

const AutoDialerActiveTable = () => {
  const { data: autoDialerCampaigns, isLoading } = useAutoDialerCampaigns();

  return (
    <div className="auto-dialer-active-table">
      <AutoDialerActiveHead />

      <DataTable
        columns={columns}
        data={autoDialerCampaigns}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AutoDialerActiveTable;
