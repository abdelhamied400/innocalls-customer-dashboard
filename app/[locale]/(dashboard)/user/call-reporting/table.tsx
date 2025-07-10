"use client";

import callReportingService from "@/services/call-reporting.service";
import { CallReportingFilters } from "@/types/api/call-reporting";
import { useQuery } from "@tanstack/react-query";
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

type CallReportingTableProps = {
  initialPagination?: {
    pageIndex: number;
    pageSize: number;
  };
  initialFilters?: CallReportingFilters;
  initialSorting?: SortingState;
};

const defaultFilters: CallReportingFilters = {
  fromDate: new Date(),
  toDate: new Date(),
  sourceExtensions: [],
  destinationExtensions: [],
  tags: [],
  callStatuses: "",
  search: "",
};

const CallReportingTable = ({
  initialFilters = {},
  initialSorting = [],
  initialPagination = {
    pageIndex: 0,
    pageSize: 10,
  },
}: CallReportingTableProps) => {
  const { toast } = useToast();

  const t = useTranslations("callReporting.messages");

  const [filters, setFilters] = useState<CallReportingFilters>({
    ...defaultFilters,
    ...initialFilters,
  });

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: initialPagination?.pageIndex || 0,
    pageSize: initialPagination?.pageSize || 10,
  });

  // Initialize the query to fetch call reporting data
  const {
    data: callReporting,
    isLoading,
    refetch,
    isError,
    error,
  } = useQuery({
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
        data={callReporting?.data || []}
        columns={columns()}
        pagination={{
          totalItems: callReporting?.total || 0,
          totalPages: callReporting?.last_page || 0,
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
