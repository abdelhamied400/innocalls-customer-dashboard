"use client";

import { PaginationState, SortingState } from "@tanstack/react-table";

import { useEffect, useState } from "react";
import { createColumns } from "./columns";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import usageService, { UsageDetailedFilters } from "@/services/usage.service";
import { useToast } from "@/hooks/use-toast";
import { isAxiosError } from "axios";
import PaginatedTable from "@/components/Table/PaginatedTable";
import DetailedUsageHead from "./head";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import { useTranslations } from "@/providers/TranslationProvider";

// 30 days ago
const defaultFromDate = new Date();
// today
const defaultToDate = new Date();

export const defaultFilters: UsageDetailedFilters = {
  codeName: "",
  fromDate: defaultFromDate,
  toDate: defaultToDate,
  accountId: "",
  packageId: "",
  origin: "",
};

const UsageDetailedTable = () => {
  const { toast } = useToast();
  const t = useTranslations("usage.detailed");
  const tCommon = useTranslations("usage.common");

  const [filters, setFilters] = useState<UsageDetailedFilters>(defaultFilters);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data = { columns: [], list: [], hasNext: false },
    isFetching,
    error,
    isError,
  } = useLocalizedQuery({
    queryKey: ["usage-detailed", filters, pagination],
    queryFn: async () =>
      usageService.fetchUsageDetailed(
        pagination.pageIndex + 1,
        pagination.pageSize,
        filters
      ),
  });

  useEffect(() => {
    if (isError) {
      let message = tCommon("unknownError");
      if (isAxiosError(error)) {
        message =
          error?.response?.data.message || t("messages.errorDescription");
      } else {
        message = error?.message || t("messages.errorDescription");
      }
      toast({
        title: t("messages.error"),
        description: message,
        variant: "destructive",
      });
      setFilters(defaultFilters);
    }
  }, [isError, error, toast]);

  return (
    <div className="h-full flex flex-col">
      <PaginatedTable
        data={data?.list || []}
        columns={createColumns(data.columns)}
        pagination={{
          totalItems: data?.list?.length || 0,
          totalPages: data?.hasNext
            ? pagination.pageIndex + 2
            : pagination.pageIndex + 1,
        }}
        onPaginationChange={(pagination) => {
          setPagination(pagination);
        }}
      >
        <DetailedUsageHead filters={filters} setFilters={setFilters} />
        <PaginatedTableContent>
          <PaginatedTableHead />
          {isFetching && <PaginatedTableSkeleton />}
          {!isFetching && <PaginatedTableBody />}
        </PaginatedTableContent>
        {!isFetching && <PaginatedTablePagination />}
      </PaginatedTable>
    </div>
  );
};

export default UsageDetailedTable;
