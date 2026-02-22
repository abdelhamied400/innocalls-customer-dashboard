"use client";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { useTranslations } from "@/providers/TranslationProvider";
import autoDialerAgentService from "@/services/auto-dialer-agent.service";
import { PaginationState } from "@tanstack/react-table";
import { useParams } from "next/navigation";
import { useState } from "react";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTable from "@/components/Table/PaginatedTable";
import { columns } from "./columns";
import CdrsHead from "./head";

const AgentCampaignCdrsTable = () => {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations("autoDialerAgent");

  const [filters, setFilters] = useState<Record<string, any>>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading } = useLocalizedQuery({
    queryKey: ["agent-auto-dialer-campaign-cdrs", id, filters, pagination],
    queryFn: async () =>
      await autoDialerAgentService.fetchAgentCampaignCdrs(id, {
        ...filters,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      }),
    refetchInterval: 30000,
    gcTime: 0,
  });

  const handleFiltersChange = (nextFilters: Record<string, any>) => {
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
        <CdrsHead filters={filters} setFilters={handleFiltersChange} />
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

export default AgentCampaignCdrsTable;
