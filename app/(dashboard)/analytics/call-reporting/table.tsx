"use client";

import callReportingService from "@/services/call-reporting.service";
import { CallReportingFilters } from "@/types/api/call-reporting";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import { columns } from "./columns";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import PaginatedTable from "@/components/Table/PaginatedTable";
import CallReportingHead from "./head";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import { useTranslations } from "@/providers/TranslationProvider";
import useAuthStore from "@/store/auth.slice";

const defaultFilters: CallReportingFilters = {
  fromDate: new Date(),
  toDate: new Date(),
  sourceExtensions: [],
  destinationExtensions: [],
  tags: [],
  callStatuses: "",
  search: "",
};

const CallReportingTable = () => {

  const tCallReporting = useTranslations("callReporting");
  const t = useTranslations("callReporting.messages");
  const { Organization } = useAuthStore();

  const [filters, setFilters] = useState<CallReportingFilters>({
    ...defaultFilters,
  });

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Initialize the query to fetch call reporting data
  const {
    data: callReporting,
    isLoading,
    refetch,
    isError,
    error,
  } = useLocalizedQuery({
    queryKey: ["call-reporting", pagination, filters],
    queryFn: async () =>
      await callReportingService.getCallReporting(
        pagination.pageIndex + 1,
        pagination.pageSize,
        filters
      ),
  });

  useEffect(() => {
    if (isError) {
      let message = t("unexpectedError");
      if (isAxiosError(error)) {
        message = error?.response?.data.message;
      } else {
        message = error?.message;
      }
      toast.error(t("errorFetchingData"), {
        description: message,
      });
      setFilters(defaultFilters);
      setTimeout(() => {
        refetch();
      }, 0);
    }
  }, [isError, error, toast]);

  // Track if this is the initial render
  const isInitialRender = useRef(true);

  useEffect(() => {
    // Skip reset on initial render
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    // Reset to first page when filters change
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [filters]);

  return (
    <div className="h-full flex flex-col">
      <PaginatedTable
        data={callReporting?.data || []}
        columns={columns(tCallReporting, {
          enableCallTranscription: Organization?.enableCallTranscription,
        })}
        pagination={{
          totalItems: callReporting?.total || 0,
          totalPages: callReporting?.last_page || 0,
          from: callReporting?.from,
          to: callReporting?.to,
        }}
        paginationState={pagination}
        onPaginationChange={setPagination}
      >
        <CallReportingHead filters={filters} setFilters={setFilters} />
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

export default CallReportingTable;
