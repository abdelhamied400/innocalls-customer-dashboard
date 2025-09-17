"use client";
import PaginatedTable from "@/components/Table/PaginatedTable";
import AgentsPerformanceHead from "./head";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import { AgentPerformance, columns } from "./columns";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { useState } from "react";
import usersService from "@/services/users.service";
import { useTranslations } from "@/providers/TranslationProvider";
import RowDetails from "./row-details";
import { format } from "date-fns";

export type AgentsPerformanceFilters = {
  fromDate: string;
  toDate: string;
  exts?: string;
  includeInternalCalls: boolean;
};

const defaultFilters: AgentsPerformanceFilters = {
  fromDate: format(new Date(), "yyyy-MM-dd"),
  toDate: format(new Date(), "yyyy-MM-dd"),
  exts: undefined,
  includeInternalCalls: false,
};

const AgentsPerformanceTable = () => {
  const t = useTranslations("users.agentPerformance.table");
  const webrtcT = useTranslations("webrtc");

  const [filters, setFilters] =
    useState<AgentsPerformanceFilters>(defaultFilters);
  const { data = [], isLoading } = useLocalizedQuery({
    queryKey: ["agents", "agents-performance", filters],
    queryFn: async () => usersService.getAgentsPerformance(filters),
    refetchInterval:
      filters.fromDate === defaultFilters.fromDate ? 30000 : false,
  });

  return (
    <div className="flex flex-col gap-0 h-full border rounded-xl">
      <PaginatedTable
        data={data}
        columns={columns(t, webrtcT)}
        manualPagination={false}
      >
        <AgentsPerformanceHead filters={filters} setFilters={setFilters} />

        <PaginatedTableContent>
          <PaginatedTableHead />
          {isLoading && <PaginatedTableSkeleton />}
          {!isLoading && (
            <PaginatedTableBody<AgentPerformance>
              renderDetails={(row) => <RowDetails row={row} />}
            />
          )}
        </PaginatedTableContent>
        {!isLoading && <PaginatedTablePagination />}
      </PaginatedTable>
    </div>
  );
};

export default AgentsPerformanceTable;
