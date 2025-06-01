"use client";

import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
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
import { CalendarIcon, ChevronDownIcon, SearchIcon } from "lucide-react";
import { createColumns } from "./columns";
import { useQuery } from "@tanstack/react-query";
import usageService, { UsageSummaryFilters } from "@/services/usage.service";
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

interface UsageSummaryTableProps {}

// 30 days ago
const fromDate = new Date();
fromDate.setDate(fromDate.getDate() - 30);
// today
const toDate = new Date();

const UsageSummaryTable = ({}: UsageSummaryTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [filters, setFilters] = useState<UsageSummaryFilters>({
    search: "",
    fromDate,
    toDate,
  });

  const {
    data = { columns: [], list: [] },
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["usageSummary", columnFilters],
    queryFn: async () => usageService.fetchUsageSummary(filters),
  });

  const columns = createColumns(data.columns);

  const table = useReactTable({
    data: data.list,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const totalItems = table.getFilteredRowModel().rows.length;
  const startRowIndex =
    table.getState().pagination.pageIndex *
      table.getState().pagination.pageSize +
    1;
  const endRowIndex = Math.min(
    (table.getState().pagination.pageIndex + 1) *
      table.getState().pagination.pageSize,
    totalItems
  );

  const handlePerPageChange = (value: string) => {
    table.setPageSize(Number(value));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // setColumnFilters((prev) => [
    //   {
    //     id: "amount",
    //     value,
    //   },
    // ]);
  };

  const pages = table.getPageCount()
    ? Array.from({ length: table.getPageCount() }, (_, i) => i + 1)
    : [];

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
        <CollapsibleContent className="border-t p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="filter" size="filter">
                Creation Date
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <FilterDialog
                title="Select a date range"
                onReset={() => {
                  setFilters((prev) => ({ ...prev, fromDate, toDate }));
                  setTimeout(() => {
                    refetch();
                  }, 0);
                }}
                onApply={() => {
                  refetch();
                }}
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
              </FilterDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </CollapsibleContent>
      </Collapsible>

      {isFetching && (
        <TableSkeleton cols={columns.length} rows={10} className="h-full" />
      )}
      {!isFetching && !data.list.length && (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No data available.</p>
        </div>
      )}
      {!isFetching && data.list.length && (
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

export default UsageSummaryTable;
