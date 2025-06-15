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
import { CalendarIcon, SearchIcon } from "lucide-react";
import { createColumns } from "./columns";
import { useQuery } from "@tanstack/react-query";
import usageService, { UsageSummaryFilters } from "@/services/usage.service";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Toggle } from "@/components/ui/toggle";
import { FilterAltOutlined } from "@mui/icons-material";
import DatePicker from "@/components/ui/date-picker";
import TableSkeleton from "@/components/ui/table-skeleton";
import { FilterBar } from "@/components/FilterBar";
import { FilterBox } from "@/components/FilterBox";
import { isValidDateRange } from "@/lib/date";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useFilters } from "@/hooks/use-filters";
import { format } from "date-fns";
import { isAxiosError } from "axios";

interface UsageSummaryTableProps {
  initialPagination?: {
    pageIndex: number;
    pageSize: number;
  };
  initialFilters?: UsageSummaryFilters;
  initialSorting?: SortingState;
}

// 30 days ago
const fromDate = new Date();
fromDate.setDate(fromDate.getDate() - 30);
// today
const toDate = new Date();

const defaultFilters = {
  search: "",
  fromDate,
  toDate,
  showBy: [],
};

const UsageSummaryTable = ({
  initialFilters = defaultFilters,
  initialSorting = [],
}: UsageSummaryTableProps) => {
  const { toast } = useToast();
  const { updateFilters } = useFilters();

  const [filters, setFilters] = useState<UsageSummaryFilters>({
    ...defaultFilters,
    ...initialFilters,
  });

  const {
    data = { columns: [], list: [] },
    refetch,
    isFetching,
    error,
    isError,
  } = useQuery({
    queryKey: ["usageSummary"],
    queryFn: async () => usageService.fetchUsageSummary(filters),
    placeholderData: { columns: [], list: [] },
    retry: 0,
  });

  const columns = createColumns(data.columns);

  const table = useReactTable({
    data: data.list,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {},
  });

  //? on any change in pagination, sorting, or filters, update the URL
  useEffect(() => {
    updateFilters({
      ...filters,
      fromDate: filters.fromDate
        ? format(filters.fromDate, "yyyy-MM-dd")
        : undefined,
      toDate: filters.toDate ? format(filters.toDate, "yyyy-MM-dd") : undefined,
      showBy: Array.isArray(filters.showBy)
        ? filters.showBy.join(",")
        : filters.showBy,
    });
  }, [filters, updateFilters]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // setColumnFilters((prev) => [
    //   {
    //     id: "amount",
    //     value,
    //   },
    // ]);
  };

  const applyFilters = () => {
    let isValid = true;
    isValid = isValidDateRange(filters.fromDate, filters.toDate, (message) => {
      toast({
        title: "Invalid date range",
        description: message,
        variant: "destructive",
      });
    });
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
  }, [isError, error, toast]);

  return (
    <div className="h-full flex flex-col">
      <Collapsible>
        <div className="usage-summary-table-head flex items-center justify-between p-4">
          <h2>Usage Summary</h2>
          <div className="actions flex items-center gap-2">
            <Field preIcon={<SearchIcon />}>
              <Input
                variant="field"
                placeholder="Search..."
                // value={
                //   (table.getColumn("amount")?.getFilterValue() as string) ?? ""
                // }
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
              setFilters({
                search: "",
                fromDate: fromDate,
                toDate: toDate,
                showBy: [],
              });
              setTimeout(() => {
                refetch();
              }, 0);
            }}
          >
            <FilterBox
              triggerLabel="Creation Date"
              label="Select a date range"
              onReset={() => {
                setFilters((prev) => ({ ...prev, fromDate, toDate }));
                setTimeout(() => {
                  refetch();
                }, 0);
              }}
              onApply={applyFilters}
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
            <FilterBox
              triggerLabel="Show By"
              label="Show by"
              onReset={() => {
                setFilters((prev) => ({
                  ...prev,
                  fromDate,
                  toDate,
                  showBy: [],
                }));
                setTimeout(() => {
                  refetch();
                }, 0);
              }}
              onApply={applyFilters}
            >
              <div className="code-name flex items-center gap-2">
                <Checkbox
                  id="codeName"
                  checked={filters.showBy?.includes("codeName")}
                  onCheckedChange={(checked) =>
                    setFilters((prev) => ({
                      ...prev,
                      showBy: checked
                        ? [...(prev.showBy || []), "codeName"]
                        : prev.showBy?.filter((item) => item !== "codeName") ||
                          [],
                    }))
                  }
                />
                <Label>Code name</Label>
              </div>
              {/* accountsName,packagesName */}
              <div className="accounts-name flex items-center gap-2">
                <Checkbox
                  id="accountsName"
                  checked={filters.showBy?.includes("accountsName")}
                  onCheckedChange={(checked) =>
                    setFilters((prev) => ({
                      ...prev,
                      showBy: checked
                        ? [...(prev.showBy || []), "accountsName"]
                        : prev.showBy?.filter(
                            (item) => item !== "accountsName"
                          ) || [],
                    }))
                  }
                />
                <Label>Accounts name</Label>
              </div>
              <div className="packages-name flex items-center gap-2">
                <Checkbox
                  id="packagesName"
                  checked={filters.showBy?.includes("packagesName")}
                  onCheckedChange={(checked) =>
                    setFilters((prev) => ({
                      ...prev,
                      showBy: checked
                        ? [...(prev.showBy || []), "packagesName"]
                        : prev.showBy?.filter(
                            (item) => item !== "packagesName"
                          ) || [],
                    }))
                  }
                />
                <Label>Packages name</Label>
              </div>
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
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default UsageSummaryTable;
