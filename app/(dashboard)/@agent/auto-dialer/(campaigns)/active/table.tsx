"use client";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { columns } from "./columns";
import autoDialerAgentService from "@/services/auto-dialer-agent.service";
import PaginatedTable from "@/components/Table/PaginatedTable";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import { useState } from "react";
import { PaginationState } from "@tanstack/react-table";
import { useTranslations } from "@/providers/TranslationProvider";

const ActiveCampaignsTable = () => {
  const t = useTranslations("autoDialerAgent");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading } = useLocalizedQuery({
    queryKey: ["agent-auto-dialer-active-campaigns", pagination],
    queryFn: async () =>
      await autoDialerAgentService.fetchAgentCampaigns({
        isActive: true,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      }),
    refetchInterval: 30000,
    gcTime: 0,
  });

  return (
    <div className="rounded-lg flex-1 flex flex-col overflow-hidden">
      <PaginatedTable
        data={data?.campaigns || []}
        columns={columns(t)}
        pagination={{
          totalItems: data?.totalItems || 0,
          totalPages: data?.totalPages || 0,
        }}
        paginationState={pagination}
        onPaginationChange={setPagination}
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
