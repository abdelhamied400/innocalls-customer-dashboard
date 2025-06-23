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
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { columns } from "./columns";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import billingService from "@/services/billing.service";
import { FilterAltOutlined, Search } from "@mui/icons-material";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Toggle } from "@/components/ui/toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FilterDialog from "@/components/FilterDialog";
import DatePicker from "@/components/ui/date-picker";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { isValidDateRange } from "@/lib/date";
import { useTranslations } from "next-intl";
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
  const { toast } = useToast();

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
  } = useQuery({
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
      toast({
        title: t("messages.error"),
        description:
          error.response?.data?.message || t("messages.errorDescription"),
        variant: "destructive",
      });
    }
  }, [isError, error]);

  return (
    <div className="h-full flex flex-col border rounded-xl">
      <PaginatedTable
        data={paymentHistory.data || []}
        columns={columns()}
        pagination={{
          totalItems: paymentHistory.total || 0,
          totalPages: paymentHistory.last_page || 0,
        }}
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
