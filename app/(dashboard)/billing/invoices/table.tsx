"use client";

import { PaginationState, SortingState } from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import { columns } from "./columns";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import billingService from "@/services/billing.service";
import { toast } from "sonner";
import { useTranslations } from "@/providers/TranslationProvider";
import PaginatedTable from "@/components/Table/PaginatedTable";
import InvoicesHead from "./head";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import { isAxiosError } from "axios";

type InvoicesFilters = {
  fromDate?: Date;
  toDate?: Date;
  fromTotal?: string | undefined;
  toTotal?: string | undefined;
  status?: "draft" | "overdue" | "paid" | "partially_paid" | null;
};

export const defaultFilters: InvoicesFilters = {
  fromDate: undefined,
  toDate: undefined,
  fromTotal: undefined,
  toTotal: undefined,
  status: null,
};

const BillingTable = () => {
  const t = useTranslations("billing.invoices");

  const [sorting, setSorting] = useState<SortingState>([]);
  const [filters, setFilters] = useState<InvoicesFilters>(defaultFilters);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: invoices = {
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
    queryKey: ["invoices", filters, pagination, sorting],
    queryFn: async () =>
      await billingService.getInvoicesList(
        pagination.pageIndex + 1,
        pagination.pageSize,
        filters,
        sorting
      ),
  });

  useEffect(() => {
    if (isError) {
      if (isAxiosError(error)) {
        toast.error("Error", {
          description: error.response?.data?.message || t("messages.unknownError"),
        });
        return;
      }
      toast.error("Error", {
        description: t("messages.unknownError"),
      });
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
    // Reset to first page when filters or sorting change
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [filters, sorting]);

  return (
    <div className="h-auto sm:h-full flex flex-col border rounded-xl">
      <PaginatedTable
        data={invoices?.data || []}
        columns={columns(t)}
        pagination={{
          totalItems: invoices?.total || 0,
          totalPages: invoices?.last_page || 0,
          from: invoices?.from,
          to: invoices?.to,
        }}
        paginationState={pagination}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
      >
        <InvoicesHead filters={filters} setFilters={setFilters} />
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
