"use client";

import callReportingService from "@/services/call-reporting.service";
import {
  AgentCallReportingFilters,
  CallReportingFilters,
} from "@/types/api/call-reporting";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import { useToast } from "@/hooks/use-toast";
import { isAxiosError } from "axios";
import PaginatedTable from "@/components/Table/PaginatedTable";
import CallReportingHead from "./head";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import { useTranslations } from "next-intl";

type CallReportingTableProps = {};

const defaultFilters: AgentCallReportingFilters = {
  fromDate: undefined,
  toDate: undefined,
  numbers: [],
  tags: [],
  direction: undefined,
};

const CallReportingTable = ({}: CallReportingTableProps) => {
  const { toast } = useToast();

  const t = useTranslations("callReporting.messages");

  const [filters, setFilters] =
    useState<AgentCallReportingFilters>(defaultFilters);

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
      await callReportingService.getAgentCallReporting(
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
      toast({
        title: t("errorFetchingData"),
        description: message,
        variant: "destructive",
      });
      setFilters(defaultFilters);
      setTimeout(() => {
        refetch();
      }, 0);
    }
  }, [isError, error, toast]);

  return (
    <div className="h-full flex flex-col">
      <PaginatedTable
        data={callReporting?.rows || []}
        columns={columns()}
        pagination={{
          totalItems: callReporting?.totalItems || 0,
          totalPages: callReporting?.totalPages || 0,
        }}
        onPaginationChange={(pagination) => {
          setPagination(pagination);
        }}
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
