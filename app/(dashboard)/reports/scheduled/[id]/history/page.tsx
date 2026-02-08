"use client";

import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { useTranslations } from "@/providers/TranslationProvider";
import scheduledReportsService from "@/services/scheduled-reports.service";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { use, useEffect, useState } from "react";
import { columns } from "./columns";
import PaginatedTable from "@/components/Table/PaginatedTable";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import ScheduledReportActions from "@/components/ScheduledReportActions";
import { WEEK_DAYS } from "@/constants/scheduled-reports";
import { ScheduledReportHistoryStatus } from "@/types/api/report";

const PROCESSING_STATUSES: ScheduledReportHistoryStatus[] = ["pending", "processing"];

type HistoryPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const HistoryPage = ({ params }: HistoryPageProps) => {
  const { id } = use(params);
  const t = useTranslations("reports.scheduled.history");

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>();

  const [hasProcessingRecords, setHasProcessingRecords] = useState(false);

  const handleSortingChange = (sorting: SortingState) => {
    if (sorting.length > 0) {
      const { id, desc } = sorting[0];
      if (id === "reportName" || id === "generatedAt") {
        setSortBy(id);
        setSortOrder(desc ? "desc" : "asc");
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      }
    }
  };

  const { data: report } = useLocalizedQuery({
    queryKey: ["scheduled-report", id],
    queryFn: () => scheduledReportsService.fetchById(id),
  });

  const { data: response, isLoading } = useLocalizedQuery({
    queryKey: [
      "scheduled-report-history",
      id,
      pagination.pageIndex,
      pagination.pageSize,
      sortBy,
      sortOrder,
    ],
    queryFn: () =>
      scheduledReportsService.fetchHistory(
        id,
        pagination.pageIndex + 1,
        pagination.pageSize,
        sortBy,
        sortOrder,
      ),
    refetchInterval: hasProcessingRecords ? 30000 : false,
  });

  const data = response?.data ?? [];
  const paginationData = response?.pagination;

  // Update processing status flag when data changes
  useEffect(() => {
    const hasProcessing = data.some((item) =>
      PROCESSING_STATUSES.includes(item.status)
    );
    setHasProcessingRecords(hasProcessing);
  }, [data]);

  return (
    <div className="page h-full" id="scheduled-report-history">
      <div className="h-full flex flex-col gap-4">
        <div className="bg-white p-4 rounded-lg flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-bold">{t("scheduleInfo.title")}</h2>
            <ScheduledReportActions report={report} />
          </div>
          <div className="border rounded-lg p-4 flex items-center gap-2">
            <div className="property flex-1 border-e">
              <p className="text-muted-foreground">{t("scheduleInfo.timezone")}</p>
              <p className="font-bold">{report?.timezone}</p>
            </div>
            {report?.frequency === "weekly" && (
              <div className="property flex-1 border-e">
                <p className="text-muted-foreground">{t("scheduleInfo.generatorDays")}</p>
                <p className="font-bold">
                  {report?.daysOfWeek?.map((day) => t(`scheduleInfo.weekDays.${WEEK_DAYS[day]}`)).join("/")}
                </p>
              </div>
            )}
            {report?.frequency === "monthly" && (
              <div className="property flex-1 border-e">
                <p className="text-muted-foreground">{t("scheduleInfo.generatorDays")}</p>
                <p>
                  <span className="font-bold">{report?.dayOfMonth}</span>{" "}
                  {t("scheduleInfo.dayOfMonthSuffix")}
                </p>
              </div>
            )}
            <div className="property flex-1">
              <p className="text-muted-foreground">{t("scheduleInfo.generatorTime")}</p>
              <p className="font-bold">{report?.time}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg flex-1 flex flex-col">
          <PaginatedTable
            data={data}
            columns={columns()}
            pagination={{
              totalItems: paginationData?.total ?? 0,
              totalPages: paginationData?.totalPages ?? 1,
              from: paginationData
                ? (paginationData.page - 1) * paginationData.perPage + 1
                : 0,
              to: paginationData
                ? Math.min(
                    paginationData.page * paginationData.perPage,
                    paginationData.total,
                  )
                : 0,
            }}
            paginationState={pagination}
            onPaginationChange={setPagination}
            onSortingChange={handleSortingChange}
          >
            <PaginatedTableContent>
              <PaginatedTableHead />
              {isLoading && <PaginatedTableSkeleton />}
              {!isLoading && <PaginatedTableBody />}
            </PaginatedTableContent>
            {!isLoading && data.length > 0 && <PaginatedTablePagination />}
            {!isLoading && data.length === 0 && (
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">{t("noHistory")}</p>
              </div>
            )}
          </PaginatedTable>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
