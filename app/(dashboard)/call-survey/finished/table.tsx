"use client";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { columns, CallSurveyCols } from "../active/columns";
import callSurveyService from "@/services/call-survey.service";
import PaginatedTable from "@/components/Table/PaginatedTable";
import CallSurveyFinishedHead from "./head";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import { useEffect, useState } from "react";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useTranslations } from "@/providers/TranslationProvider";

const CallSurveyFinishedTable = () => {
  const t = useTranslations("callSurvey");
  const [filters, setFilters] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const sortParams =
    sorting.length > 0 && ["name", "createdAt"].includes(sorting[0].id)
      ? {
          sortBy: sorting[0].id,
          sortOrder: sorting[0].desc ? "desc" : "asc",
        }
      : {};

  const { data, isLoading, isError, error } = useLocalizedQuery<{
    surveys: CallSurveyCols[];
    totalItems: number;
    totalPages: number;
  }>({
    queryKey: ["call-survey-finished-list", filters, pagination, sorting],
    queryFn: async () =>
      await callSurveyService.fetchSurveys({
        ...filters,
        ...sortParams,
        isActive: false,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      }),
    gcTime: 0,
  });

  useEffect(() => {
    if (isError) {
      if (isAxiosError(error)) {
        toast.error("Error", {
          description: error.response?.data?.message || "An error occurred",
        });
        return;
      }
      toast.error("Error", { description: "An error occurred" });
    }
  }, [isError, error]);

  const handleFiltersChange = (nextFilters: typeof filters) => {
    setFilters(nextFilters);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  return (
    <div className="rounded-lg flex-1 flex flex-col overflow-hidden">
      <PaginatedTable
        data={data?.surveys || []}
        columns={columns(t)}
        pagination={{
          totalItems: data?.totalItems || 0,
          totalPages: data?.totalPages || 0,
        }}
        paginationState={pagination}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
      >
        <CallSurveyFinishedHead
          filters={filters}
          setFilters={handleFiltersChange}
        />
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

export default CallSurveyFinishedTable;
