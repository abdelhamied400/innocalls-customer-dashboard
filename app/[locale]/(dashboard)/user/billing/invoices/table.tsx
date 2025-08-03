"use client";

import { PaginationState, SortingState } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import billingService from "@/services/billing.service";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
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
  const { toast } = useToast();
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
        toast({
          title: "Error",
          description:
            error.response?.data?.message || t("messages.unknownError"),
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Error",
        description: t("messages.unknownError"),
        variant: "destructive",
      });
    }
  }, [isError, error, toast]);

  return (
    <div className="h-auto sm:h-full flex flex-col border rounded-xl">
      <PaginatedTable
        data={invoices?.data || []}
        columns={columns()}
        pagination={{
          totalItems: invoices?.total || 0,
          totalPages: invoices?.last_page || 0,
        }}
        onPaginationChange={(pagination) => {
          setPagination(pagination);
        }}
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
