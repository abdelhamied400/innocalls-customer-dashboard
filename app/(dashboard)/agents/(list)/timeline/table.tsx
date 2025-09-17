"use client";
import PaginatedTable from "@/components/Table/PaginatedTable";
import TimelineHead from "./head";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import { AgentTimeline, columns } from "./columns";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { useState } from "react";
import usersService from "@/services/users.service";
import { useTranslations } from "@/providers/TranslationProvider";
import RowDetails from "./row-details";
import { format } from "date-fns";

export type TimelineFilters = {
  fromDate: string;
  toDate: string;
  exts?: string;
  includeInternalCalls: boolean;
};

const defaultFilters: TimelineFilters = {
  fromDate: format(new Date(), "yyyy-MM-dd"),
  toDate: format(new Date(), "yyyy-MM-dd"),
  exts: undefined,
  includeInternalCalls: false,
};

const TimelineTable = () => {
  const t = useTranslations("users.timeline.table");

  const [filters, setFilters] = useState<TimelineFilters>(defaultFilters);
  const { data = [], isLoading } = useLocalizedQuery({
    queryKey: ["agents", "timeline", filters],
    queryFn: async () => usersService.getTimeline(filters),
    refetchInterval:
      filters.fromDate === defaultFilters.fromDate ? 30000 : false,
  });

  return (
    <div className="flex flex-col gap-0 h-full border rounded-xl">
      <PaginatedTable data={data} columns={columns(t)} manualPagination={false}>
        <TimelineHead filters={filters} setFilters={setFilters} />

        <PaginatedTableContent>
          <PaginatedTableHead />
          {isLoading && <PaginatedTableSkeleton />}
          {!isLoading && (
            <PaginatedTableBody<AgentTimeline>
              renderDetails={(row) => <RowDetails row={row} />}
              sticky
            />
          )}
        </PaginatedTableContent>
        {!isLoading && <PaginatedTablePagination />}
      </PaginatedTable>
    </div>
  );
};

export default TimelineTable;
