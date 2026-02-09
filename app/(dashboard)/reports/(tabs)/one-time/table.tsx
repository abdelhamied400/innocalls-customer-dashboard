"use client";

import { OneTimeReportFilters, OneTimeReportStatus } from "@/types/api/report";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import PaginatedTable from "@/components/Table/PaginatedTable";
import OneTimeReportHead from "./head";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import oneTimeReportsService from "@/services/one-time-reports.service";
import { useTranslations } from "@/providers/TranslationProvider";

const PROCESSING_STATUSES: OneTimeReportStatus[] = ["pending", "processing"];

const defaultFilters: OneTimeReportFilters = {
  sortBy: "createdAt",
  sortOrder: "desc",
};

const OneTimeReportTable = () => {
  const t = useTranslations("reports.oneTime");
  const [filters, setFilters] = useState<OneTimeReportFilters>({
    ...defaultFilters,
  });

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const handleSortingChange = (sorting: SortingState) => {
    if (sorting.length > 0) {
      const { id, desc } = sorting[0];
      // Only allow sorting by createdAt or name
      if (id === "createdAt" || id === "name") {
        setFilters((prev) => ({
          ...prev,
          sortBy: id,
          sortOrder: desc ? "desc" : "asc",
        }));
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      }
    }
  };

  const [hasProcessingRecords, setHasProcessingRecords] = useState(false);

  const { data: response, isLoading } = useLocalizedQuery({
    queryKey: ["one-time-reports", pagination.pageIndex, pagination.pageSize, filters],
    queryFn: () =>
      oneTimeReportsService.fetchAll({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        filters,
      }),
    refetchInterval: hasProcessingRecords ? 30000 : false,
  });

  const data = response?.data ?? [];
  const paginationData = response?.pagination;

  // Update processing status flag when data changes
  useEffect(() => {
    const hasProcessing = data.some((report) =>
      PROCESSING_STATUSES.includes(report.status)
    );
    setHasProcessingRecords(hasProcessing);
  }, [data]);

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
        <OneTimeReportHead filters={filters} setFilters={setFilters} />
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

export default OneTimeReportTable;
