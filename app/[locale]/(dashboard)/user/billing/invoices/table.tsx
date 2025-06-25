"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationButton,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Field from "@/components/ui/field";
import { columns } from "./columns";
import { useQuery } from "@tanstack/react-query";
import billingService from "@/services/billing.service";
import { CalendarMonth, FilterAltOutlined, Search } from "@mui/icons-material";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Toggle } from "@/components/ui/toggle";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { FilterBar } from "@/components/FilterBar";
import { FilterBox } from "@/components/FilterBox";
import { isValidDateRange } from "@/lib/date";
import DatePicker from "@/components/ui/date-picker";
import { format } from "date-fns";
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
  search: string;
  fromDate?: Date | undefined;
  toDate?: Date | undefined;
  fromTotal?: string;
  toTotal?: string;
  status?: "draft" | "overdue" | "paid" | "partially_paid" | null;
};

const BillingTable = () => {
  const { toast } = useToast();
  const t = useTranslations("billing.invoices");

  const [sorting, setSorting] = useState<SortingState>([]);
  const [filters, setFilters] = useState<InvoicesFilters>({
    search: "",
    fromDate: undefined,
    toDate: undefined,
    fromTotal: "",
    toTotal: "",
    status: null,
  });
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
  } = useQuery({
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
    <div className="h-full flex flex-col border rounded-xl">
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
