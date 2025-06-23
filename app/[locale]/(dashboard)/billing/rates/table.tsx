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
import { useState } from "react";
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
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTranslations } from "next-intl";
import RatesHead from "./head";
import PaginatedTable from "@/components/Table/PaginatedTable";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";

type RatesFilters = {
  search: string;
  serviceId?: string;
};

const BillingTable = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filters, setFilters] = useState<RatesFilters>({
    search: "",
    serviceId: "1",
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: rates = {
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
  } = useQuery({
    queryKey: ["rates", pagination, filters],
    queryFn: async () =>
      await billingService.getRatesList(
        pagination.pageIndex + 1,
        pagination.pageSize,
        {
          filter: filters.search,
          serviceId: filters.serviceId,
        }
      ),
  });

  return (
    <div className="h-full flex flex-col border rounded-xl">
      <PaginatedTable
        data={rates.data || []}
        columns={columns()}
        pagination={{
          totalItems: rates.total || 0,
          totalPages: rates.last_page || 0,
        }}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
      >
        <RatesHead filters={filters} setFilters={setFilters} />

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
