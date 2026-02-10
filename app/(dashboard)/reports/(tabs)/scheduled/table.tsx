"use client";

import { ScheduledReportFilters } from "@/types/api/report";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { useState } from "react";
import { columns } from "./columns";
import PaginatedTable from "@/components/Table/PaginatedTable";
import ScheduledReportHead from "./head";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import scheduledReportsService from "@/services/scheduled-reports.service";
import { useTranslations } from "@/providers/TranslationProvider";

export const defaultFilters: ScheduledReportFilters = {
  sortBy: "createdAt",
  sortOrder: "desc",
};

const ScheduledReportTable = () => {
  const t = useTranslations("reports.scheduled");
  const [filters, setFilters] = useState<ScheduledReportFilters>({
    ...defaultFilters,
  });

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const handleSortingChange = (sorting: SortingState) => {
    if (sorting.length > 0) {
      const { id, desc } = sorting[0];
      // Only allow sorting by createdAt, name, or nextGenerationAtLocal
      if (id === "createdAt" || id === "name" || id === "nextGenerationAtLocal") {
        // Map column accessor to API sort key
        const sortBy = id === "nextGenerationAtLocal" ? "nextGenerationAt" : id;
        setFilters((prev) => ({
          ...prev,
          sortBy,
          sortOrder: desc ? "desc" : "asc",
        }));
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      }
    }
  };

  const { data: response, isLoading } = useLocalizedQuery({
    queryKey: ["scheduled-reports", pagination.pageIndex, pagination.pageSize, filters],
    queryFn: () =>
      scheduledReportsService.fetchAll({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        filters,
      }),
  });

  const data = response?.data ?? [];
  const paginationData = response?.pagination;

  return (
    <div className="h-full flex flex-col">
      <PaginatedTable
        data={data}
        columns={columns(t)}
        pagination={{
          totalItems: paginationData?.total ?? 0,
          totalPages: paginationData?.totalPages ?? 1,
          from: paginationData ? (paginationData.page - 1) * paginationData.perPage + 1 : 0,
          to: paginationData
            ? Math.min(paginationData.page * paginationData.perPage, paginationData.total)
            : 0,
        }}
        paginationState={pagination}
        onPaginationChange={setPagination}
        onSortingChange={handleSortingChange}
      >
        <ScheduledReportHead filters={filters} setFilters={setFilters} />
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

export default ScheduledReportTable;
