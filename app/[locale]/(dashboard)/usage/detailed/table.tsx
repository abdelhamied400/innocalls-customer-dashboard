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
import { CalendarIcon, ChevronDownIcon, SearchIcon } from "lucide-react";
import { createColumns } from "./columns";
import { useQuery } from "@tanstack/react-query";
import usageService, { UsageDetailedFilters } from "@/services/usage.service";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toggle } from "@/components/ui/toggle";
import { FilterAltOutlined } from "@mui/icons-material";
import { Button } from "@/components/ui/button";
import FilterDialog from "@/components/FilterDialog";
import DatePicker from "@/components/ui/date-picker";
import { DataTableSkeleton } from "@/components/ui/data-table";
import TableSkeleton from "@/components/ui/table-skeleton";
import { FilterBar } from "@/components/FilterBar";
import { FilterBox } from "@/components/FilterBox";
import { isValidDateRange } from "@/lib/date";
import { useToast } from "@/hooks/use-toast";
import useVocabStore from "@/store/vocab.slice";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Paginated } from "@/types/shared/paginated";
import { useRouter } from "next/navigation";
import { useFilters } from "@/hooks/use-filters";
import { format } from "date-fns";
import { isAxiosError } from "axios";

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
  const router = useRouter();
  const { updateFilters } = useFilters();
  const { packages, accounts } = useVocabStore();

  const [filters, setFilters] = useState<UsageDetailedFilters>({
    ...defaultFilters,
    ...initialFilters,
  });

  const [pagesCount, setPagesCount] = useState<number>(
    initialPagination.pageIndex
  );
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: initialPagination?.pageIndex || 0,
    pageSize: initialPagination?.pageSize || 10,
  });

  const {
    data = { columns: [], list: [], hasNext: false },
    refetch,
    isFetching,
    error,
    isError,
  } = useQuery({
    queryKey: ["usage-detailed", pagination.pageIndex, pagination.pageSize],
    queryFn: async () =>
      usageService.fetchUsageDetailed(
        pagination.pageIndex + 1,
        pagination.pageSize,
        filters
      ),
    placeholderData: { columns: [], list: [], hasNext: false },
    retry: 0,
  });

  const table = useReactTable({
    data: data.list,
    columns: createColumns(data.columns),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    state: {
      pagination,
    },
  });

  // Update the pages count when callReporting data changes
  useEffect(() => {
    if (data.hasNext && !isFetching) {
      setPagesCount((prev) => pagination.pageIndex + 2);
    }
  }, [data.hasNext, pagination.pageIndex, isFetching]);

  // pagination calculations
  const { pageIndex, pageSize } = table.getState().pagination;
  const totalItems = table.getFilteredRowModel().rows.length;
  const startRowIndex = pageIndex * pageSize + 1;
  const endRowIndex = Math.min((pageIndex + 1) * pageSize, totalItems);
  const pages = Array.from({ length: pagesCount }, (_, i) => i + 1);

  //? on any change in pagination, sorting, or filters, update the URL
  useEffect(() => {
    updateFilters({
      page: (pageIndex + 1).toString(),
      pageSize: pageSize.toString(),
      ...filters,
      fromDate: filters.fromDate
        ? format(filters.fromDate, "yyyy-MM-dd")
        : undefined,
      toDate: filters.toDate ? format(filters.toDate, "yyyy-MM-dd") : undefined,
    });
  }, [pageIndex, pageSize, filters, updateFilters]);

  const handlePerPageChange = (value: string) => {
    table.setPageSize(Number(value));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters((prev) => ({
      ...prev,
      codeName: value,
    }));
    updateFilters({ codeName: value });
    setTimeout(() => {
      refetch();
    }, 0);
  };

  const applyFilters = () => {
    const isValid = isValidDateRange(
      filters.fromDate,
      filters.toDate,
      (message) => {
        toast({
          title: "Invalid date range",
          description: message,
          variant: "destructive",
        });
      }
    );

    if (!isValid) return;

    setTimeout(() => {
      refetch();
    }, 0);
  };

  useEffect(() => {
    if (isError) {
      let message = "An unexpected error occurred";
      if (isAxiosError(error)) {
        message = error?.response?.data.message;
      } else {
        message = error?.message;
      }
      toast({
        title: "Error fetching data",
        description: message,
        variant: "destructive",
      });
      setFilters(defaultFilters);
      setTimeout(() => {
        refetch();
      }, 0);
    }
  }, [isError, error, toast, router]);

  return (
    <div className="h-full flex flex-col">
      <Collapsible>
        <div className="usage-detailed-table-head flex items-center justify-between p-4">
          <h2>Usage Detailed</h2>
          <div className="actions flex items-center gap-2">
            <Field preIcon={<SearchIcon />}>
              <Input
                variant="field"
                placeholder="Search..."
                value={filters.codeName}
                onChange={handleSearchChange}
                type="search"
              />
            </Field>
            <CollapsibleTrigger asChild>
              <Toggle pressed={true} className="rounded-full">
                <FilterAltOutlined />
              </Toggle>
            </CollapsibleTrigger>
          </div>
        </div>
        <CollapsibleContent>
          <FilterBar
            onClear={() => {
              setFilters(defaultFilters);
              setTimeout(() => {
                refetch();
              }, 0);
            }}
          >
            <FilterBox
              triggerLabel="Account"
              label="Select an account"
              onReset={() => {
                setFilters((prev) => ({ ...prev, accountId: "" }));
                setTimeout(() => {
                  refetch();
                }, 0);
              }}
              onApply={applyFilters}
              numberOfFilters={filters.accountId ? 1 : 0}
            >
              <Select
                onValueChange={(value) => {
                  setFilters((prev) => ({
                    ...prev,
                    accountId: value || "",
                  }));
                }}
                value={filters.accountId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts?.map((account) => (
                    <SelectItem key={account.id} value={account.id.toString()}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterBox>
            <FilterBox
              triggerLabel="Origin"
              label="Select an origin"
              onReset={() => {
                setFilters((prev) => ({ ...prev, origin: "" }));
                setTimeout(() => {
                  refetch();
                }, 0);
              }}
              onApply={applyFilters}
              numberOfFilters={filters.origin ? 1 : 0}
            >
              <RadioGroup
                defaultValue=""
                onValueChange={(value) => {
                  setFilters((prev) => ({
                    ...prev,
                    origin: value || "",
                  }));
                }}
                value={filters.origin}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="orig" id="orig" />
                  <Label htmlFor="orig">Outgoing</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="term" id="term" />
                  <Label htmlFor="term">Incoming</Label>
                </div>
              </RadioGroup>
            </FilterBox>
            <FilterBox
              triggerLabel="Package"
              label="Select a package"
              onReset={() => {
                setFilters((prev) => ({ ...prev, packageId: "" }));
                setTimeout(() => {
                  refetch();
                }, 0);
              }}
              onApply={applyFilters}
              numberOfFilters={filters.packageId ? 1 : 0}
            >
              <Select
                onValueChange={(value) => {
                  setFilters((prev) => ({
                    ...prev,
                    packageId: value || "",
                  }));
                }}
                value={filters.packageId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an account" />
                </SelectTrigger>
                <SelectContent>
                  {packages?.map((pkg) => (
                    <SelectItem key={pkg.id} value={pkg.id.toString()}>
                      {pkg.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterBox>
            <FilterBox
              triggerLabel="Date Range"
              label="Select a date range"
              onReset={() => {
                setFilters((prev) => ({
                  ...prev,
                  fromDate: defaultToDate,
                  toDate: defaultToDate,
                }));
                setTimeout(() => {
                  refetch();
                }, 0);
              }}
              onApply={applyFilters}
              numberOfFilters={
                (filters.fromDate ? 1 : 0) + (filters.toDate ? 1 : 0)
              }
            >
              <Field
                label="From"
                hint="DD/MM/YYYY"
                postIcon={<CalendarIcon className="text-gray-400" />}
              >
                <DatePicker
                  className="flex-1"
                  placeholder="Enter from date"
                  value={filters.fromDate}
                  onChange={(date) =>
                    setFilters((prev) => ({
                      ...prev,
                      fromDate: date || undefined,
                    }))
                  }
                />
              </Field>
              <Field
                label="To"
                hint="DD/MM/YYYY"
                postIcon={<CalendarIcon className="text-gray-400" />}
              >
                <DatePicker
                  className="flex-1"
                  placeholder="Enter to date"
                  value={filters.toDate}
                  onChange={(date) =>
                    setFilters((prev) => ({
                      ...prev,
                      toDate: date || undefined,
                    }))
                  }
                />
              </Field>
            </FilterBox>
          </FilterBar>
        </CollapsibleContent>
      </Collapsible>

      {isFetching && <TableSkeleton cols={6} rows={10} className="h-full" />}
      {!isFetching && !data.list.length && (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No data available.</p>
        </div>
      )}
      {!isFetching && data.list.length > 0 && (
        <div className="flex-1 overflow-auto">
          <Table className="min-h-full w-full">
            <TableHeader className="bg-gray-100 sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      <div className="flex justify-between items-center gap-2 p-4">
        <div className="pagination">
          <Pagination className="justify-normal">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => {
                    table.previousPage();
                  }}
                  disabled={!table.getCanPreviousPage()}
                />
              </PaginationItem>

              {pages.map((page, idx) => (
                <PaginationItem key={`page-${page}, ${idx}`}>
                  <PaginationButton
                    isActive={
                      table.getState().pagination.pageIndex + 1 === page
                    }
                    onClick={() => table.setPageIndex(page - 1)}
                  >
                    {page}
                  </PaginationButton>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => {
                    table.nextPage();
                  }}
                  disabled={!table.getCanNextPage()}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        <div className="flex items-center gap-2 per-page">
          <label className="text-sm">Rows per page:</label>
          <Select
            onValueChange={handlePerPageChange}
            defaultValue={table.getState().pagination.pageSize.toString()}
          >
            <SelectTrigger className="w-max">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="30">30</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm">
            {startRowIndex}-{endRowIndex}
            {totalItems ? ` of ${totalItems}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UsageDetailedTable;
