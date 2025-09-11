"use client";
import PaginatedTable from "@/components/Table/PaginatedTable";
import AgentsPerformanceHead from "./head";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import { columns } from "./columns";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { useState } from "react";
import usersService from "@/services/users.service";
import { useTranslations } from "@/providers/TranslationProvider";

export type AgentsPerformanceFilters = {
  fromDate: string;
  toDate: string;
};

const defaultFilters: AgentsPerformanceFilters = {
  fromDate: "2025-09-09",
  toDate: "2025-09-09",
};

const AgentsPerformanceTable = () => {
  const t = useTranslations("agents.performance");
  const [filters, setFilters] =
    useState<AgentsPerformanceFilters>(defaultFilters);
  const {
    data = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useLocalizedQuery({
    queryKey: ["agents", "agents-performance", filters],
    queryFn: async () => usersService.getAgentsPerformance(filters),
    refetchInterval: 30000,
  });

  return (
    <div className="flex flex-col gap-0 h-full border rounded-xl">
      <PaginatedTable data={data} columns={columns(t)} manualPagination={false}>
        <AgentsPerformanceHead filters={filters} setFilters={setFilters} />

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

export default AgentsPerformanceTable;
