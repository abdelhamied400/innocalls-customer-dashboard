"use client";

import { PaginationState, SortingState } from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import { columns } from "./columns";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import billingService from "@/services/billing.service";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useTranslations } from "@/providers/TranslationProvider";
import PaginatedTable from "@/components/Table/PaginatedTable";
import PaymentHistoryHead from "./head";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";

type PaymentHistoryFilters = {
  fromDate?: Date;
  toDate?: Date;
};

// 30 days ago
const fromDate = new Date();
fromDate.setDate(fromDate.getDate() - 30);
// today
const toDate = new Date();

const BillingTable = () => {

  const t = useTranslations("billing.paymentHistory");

  const [sorting, setSorting] = useState<SortingState>([]);
  const [filters, setFilters] = useState<PaymentHistoryFilters>({
    fromDate,
    toDate,
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: paymentHistory = {
      data: [],
      current_page: 1,
      from: 1,
      last_page: 1,
      page: 1,
      per_page: 10,
      to: 1,
      total: 0,
    },
    isLoading,
    isError,
    error,
  } = useLocalizedQuery({
    queryKey: ["payment-history", pagination, filters, sorting],
    queryFn: async () =>
      await billingService.getPaymentsList(
        pagination.pageIndex + 1,
        pagination.pageSize,
        filters
      ),
    retry: 0,
  });

  useEffect(() => {
    if (isError && error instanceof AxiosError) {
      toast.error(t("messages.error"), {
        description: error.response?.data?.message || t("messages.errorDescription"),
      });
    }
  }, [isError, error]);

  // Track if this is the initial render
  const isInitialRender = useRef(true);

  useEffect(() => {
    // Skip reset on initial render
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    // Reset to first page when filters or sorting change
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [filters, sorting]);

  return (
    <div className="h-auto sm:h-full flex flex-col border rounded-xl">
      <PaginatedTable
        data={paymentHistory.data || []}
        columns={columns()}
        pagination={{
          totalItems: paymentHistory.total || 0,
          totalPages: paymentHistory.last_page || 0,
          from: paymentHistory.from,
          to: paymentHistory.to,
        }}
        paginationState={pagination}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
      >
        <PaymentHistoryHead filters={filters} setFilters={setFilters} />

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
