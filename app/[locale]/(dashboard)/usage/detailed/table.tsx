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
import { CalendarIcon, SearchIcon } from "lucide-react";
import { createColumns } from "./columns";
import { useQuery } from "@tanstack/react-query";
import usageService, { UsageDetailedFilters } from "@/services/usage.service";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Toggle } from "@/components/ui/toggle";
import { Download, FilterAltOutlined } from "@mui/icons-material";
import DatePicker from "@/components/ui/date-picker";
import TableSkeleton from "@/components/ui/table-skeleton";
import { FilterBar } from "@/components/FilterBar";
import { FilterBox } from "@/components/FilterBox";
import { isValidDateRange } from "@/lib/date";
import { useToast } from "@/hooks/use-toast";
import useVocabStore from "@/store/vocab.slice";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useFilters } from "@/hooks/use-filters";
import { format } from "date-fns";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";
import PaginatedTable from "@/components/Table/PaginatedTable";
import DetailedUsageHead from "./head";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import { useTranslations } from "next-intl";

interface UsageDetailedTableProps {
  initialPagination?: {
    pageIndex: number;
    pageSize: number;
  };
  initialFilters?: UsageDetailedFilters;
  initialSorting?: SortingState;
}

// 30 days ago
const defaultFromDate = new Date();
defaultFromDate.setDate(defaultFromDate.getDate() - 30);
// today
const defaultToDate = new Date();

const defaultFilters: UsageDetailedFilters = {
  codeName: "",
  fromDate: defaultFromDate,
  toDate: defaultToDate,
  accountId: "",
  packageId: "",
  origin: "",
};

const UsageDetailedTable = ({
  initialFilters = {},
  initialSorting = [],
  initialPagination = {
    pageIndex: 0,
    pageSize: 10,
  },
}: UsageDetailedTableProps) => {
  const { toast } = useToast();
  const t = useTranslations("usage.detailed");
  const tCommon = useTranslations("usage.common");

  const [filters, setFilters] = useState<UsageDetailedFilters>({
    ...defaultFilters,
    ...initialFilters,
  });

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: initialPagination?.pageIndex || 0,
    pageSize: initialPagination?.pageSize || 10,
  });

  const {
    data = { columns: [], list: [], hasNext: false },
    isFetching,
    error,
    isError,
  } = useQuery({
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
