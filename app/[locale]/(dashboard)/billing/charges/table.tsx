"use client";

import { PaginationState, SortingState } from "@tanstack/react-table";

import { useEffect, useState } from "react";
import { columns } from "./columns";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import billingService from "@/services/billing.service";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { useTranslations } from "next-intl";
import ChargesHead from "./head";
import PaginatedTable from "@/components/Table/PaginatedTable";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";

type ChargesFilters = {
  fromDate?: Date;
  toDate?: Date;
};

// 30 days ago
const fromDate = new Date();
fromDate.setDate(fromDate.getDate() - 30);
// today
const toDate = new Date();

const BillingTable = () => {
  const { toast } = useToast();

  const t = useTranslations("billing.charges");

  const [sorting, setSorting] = useState<SortingState>([]);
  const [filters, setFilters] = useState<ChargesFilters>({
    fromDate,
    toDate,
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: charges = {
      data: [],
      current_page: 1,
      from: 1,
      last_page: 1,
      page: 1,
      per_page: 10,
      to: 1,
      total: 0,
    },
    isError,
    error,
    isLoading,
  } = useLocalizedQuery({
    queryKey: ["charges", pagination, filters, sorting],
    queryFn: async () =>
      await billingService.getChargesList(
        pagination.pageIndex + 1,
        pagination.pageSize,
        filters
      ),
  });

  useEffect(() => {
    if (isError && error instanceof AxiosError) {
      toast({
        title: t("messages.error"),
        description:
          error.response?.data?.message || t("messages.errorDescription"),
        variant: "destructive",
      });
    }
  }, [isError, error]);

  return (
    <div className="h-auto sm:h-full flex flex-col border rounded-xl">
      <PaginatedTable
        data={charges.data || []}
        columns={columns()}
        pagination={{
          totalItems: charges.total || 0,
          totalPages: charges.last_page || 0,
        }}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
      >
        <ChargesHead filters={filters} setFilters={setFilters} />

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

export default BillingTable;
