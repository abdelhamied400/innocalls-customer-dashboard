"use client";

import {
  ColumnFiltersState,
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
import { useEffect, useMemo, useState } from "react";
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
import { SearchIcon } from "lucide-react";
import { columns } from "./columns";
import { useQuery } from "@tanstack/react-query";
import callReportingService from "@/services/call-reporting.service";
import { Button } from "@/components/ui/button";
import { Call, CallReportingFilters } from "@/types/api/call-reporting";
import { useToast } from "@/hooks/use-toast";
import { isAxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import CallReportingTableHeader from "./CallReportingTableHeader";
import CallReportingTableBody from "./CallReportingTableBody";
import CallReportingTablePagination from "./CallReportingTablePagination";
import { Paginated } from "@/types/shared/paginated";

type CallReportingTableProps = {
  initialData: Paginated<Call>;
  initialPagination?: {
    pageIndex: number;
    pageSize: number;
  };
  initialFilters?: ColumnFiltersState;
  initialSorting?: SortingState;
};

const CallReportingTable = ({
  initialData,
  initialFilters = [],
  initialSorting = [],
  initialPagination,
}: CallReportingTableProps) => {
  const { toast } = useToast();
  const session = useSession();
  const router = useRouter();

  // sorting, filters, and pagination state
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>(initialFilters);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: initialPagination?.pageIndex || 0,
    pageSize: initialPagination?.pageSize || 10,
  });
  const memoPagination = useMemo(
    () => pagination,
    [pagination.pageIndex, pagination.pageSize]
  );
  const memoFilters = useMemo(() => columnFilters, [columnFilters]);

  const {
    data: callReporting,
    isLoading,
    isFetching,
    isRefetching,
  } = useQuery({
    queryKey: ["call-reporting", pagination, columnFilters],
    queryFn: async () =>
      await callReportingService.getCallReporting(
        pagination.pageIndex + 1,
        pagination.pageSize,
        columnFilters
      ),
    initialData,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  const table = useReactTable({
    data: callReporting?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    pageCount: callReporting?.last_page,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  });

  const tableSorting = table.getState().sorting;
  // pagination calculations
  const { pageIndex, pageSize } = table.getState().pagination;
  const totalItems = table.getFilteredRowModel().rows.length;
  const startRowIndex = pageIndex * pageSize + 1;
  const endRowIndex = Math.min((pageIndex + 1) * pageSize, totalItems);
  const pages = table.getPageCount()
    ? Array.from({ length: table.getPageCount() }, (_, i) => i + 1)
    : [];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const search = event.target.value;
    table.getColumn("destination")?.setFilterValue(search ? search : undefined); // clear filter if empty
    setPagination((prev) => ({ ...prev, pageIndex: 0 })); // reset to page 1 on search
  };

  const handleExport = async () => {
    if (!session.data) return;
    try {
      // await callReportingService.exportCallReporting({
      //   ...filters,
      //   userEmail: session.data.user.email,
      // });
      toast({
        title: "Export Successful",
        description:
          "Your call reporting data will be sent to your email shortly.",
        variant: "success",
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast({
          title: "Export Failed",
          description:
            error.response?.data?.message ||
            "An error occurred while exporting.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Unknown Error",
          description: "unknown error occurred please try again later",
        });
      }
    }
  };

  //? on any change in pagination, sorting, or filters, update the URL
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", (pageIndex + 1).toString());
    params.set("pageSize", pageSize.toString());

    if (columnFilters.length > 0) {
      columnFilters.forEach((filter) => {
        if (filter.value) {
          params.set(filter.id, filter.value as string);
        }
      });
    }

    if (tableSorting.length > 0) {
      tableSorting.forEach((sort) => {
        params.set(`sort_${sort.id}`, sort.desc ? "desc" : "asc");
      });
    }

    // router.push(`?${params.toString()}`);
  }, [pageIndex, pageSize, columnFilters, tableSorting, router]);

  return (
    <div className="h-full flex flex-col">
      <CallReportingTableHeader
        searchValue={
          (table.getColumn("destination")?.getFilterValue() as string) || ""
        }
        onSearchChange={handleSearchChange}
        onExport={handleExport}
      />
      {isFetching ? "Loading..." : null}
      <CallReportingTableBody table={table} isLoading={isFetching} />
      {!isFetching && table.getRowModel().rows?.length && (
        <CallReportingTablePagination
          table={table}
          lastPage={callReporting?.last_page || 0}
          from={callReporting?.from || 0}
          to={callReporting?.to || 0}
          total={callReporting?.total || 0}
        />
      )}
    </div>
  );
};

export default CallReportingTable;
