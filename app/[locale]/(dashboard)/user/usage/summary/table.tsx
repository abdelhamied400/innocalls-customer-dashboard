"use client";

import { useEffect, useState } from "react";
import { PaginationButton } from "@/components/ui/pagination";
import { createColumns } from "./columns";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import usageService, { UsageSummaryFilters } from "@/services/usage.service";
import { useToast } from "@/hooks/use-toast";
import { isAxiosError } from "axios";
import PaginatedTable from "@/components/Table/PaginatedTable";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import UsageSummaryHead from "./head";
import { useTranslations } from "next-intl";

// 30 days ago
const defaultFromDate = new Date();
defaultFromDate.setDate(defaultFromDate.getDate() - 30);
// today
const defaultToDate = new Date();

const defaultFilters = {
  search: "",
  fromDate: defaultFromDate,
  toDate: defaultToDate,
  groupBy: [],
};

const UsageSummaryTable = ({}) => {
  const { toast } = useToast();
  const t = useTranslations("usage.summary");
  const tCommon = useTranslations("usage.common");

  const [filters, setFilters] = useState<UsageSummaryFilters>(defaultFilters);

  const {
    data = { columns: [], list: [] },
    refetch,
    isLoading,
    error,
    isError,
  } = useLocalizedQuery({
    queryKey: ["usageSummary", filters],
    queryFn: async () => usageService.fetchUsageSummary(filters),
  });

  const columns = createColumns(data.columns);

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
      setTimeout(() => {
        refetch();
      }, 0);
    }
  }, [isError, error, toast]);

  return (
    <div className="h-full flex flex-col">
      <PaginatedTable
        data={data.list || []}
        columns={columns}
        manualPagination={false}
      >
        <UsageSummaryHead filters={filters} setFilters={setFilters} />

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

export default UsageSummaryTable;
