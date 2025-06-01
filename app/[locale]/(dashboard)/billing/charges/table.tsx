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
import DatePicker from "@/components/ui/date-picker";
import { format } from "date-fns";

type ChargesFilters = {
  search: string;
  fromDate?: Date;
  toDate?: Date;
};

// 30 days ago
const fromDate = new Date();
fromDate.setDate(fromDate.getDate() - 30);
// today
const toDate = new Date();

const BillingTable = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filters, setFilters] = useState<ChargesFilters>({
    search: "",
    fromDate,
    toDate,
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: charges = {
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
    refetch,
  } = useQuery({
    queryKey: ["charges", pagination.pageIndex, pagination.pageSize],
    queryFn: async () =>
      await billingService.getChargesList(
        pagination.pageIndex + 1,
        pagination.pageSize,
        {
          search: filters.search,
          fromDate: format(filters.fromDate || fromDate, "yyyy-MM-dd"),
          toDate: format(filters.toDate || toDate, "yyyy-MM-dd"),
        }
      ),
  });

  const table = useReactTable({
    data: charges.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    pageCount: charges.last_page,
    manualPagination: true,
    manualFiltering: true,
    state: {
      sorting,
      pagination,
    },
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const search = event.target.value;
    setFilters((prev) => ({
      ...prev,
      search,
    }));
  };

  return (
    <div className="h-full flex flex-col border rounded-xl">
      <Collapsible>
        <div className="users-table-head flex items-center justify-between p-4">
          <h2>Charges</h2>
          <div className="actions flex items-center gap-2">
            <Field preIcon={<Search />}>
              <Input
                variant="field"
                placeholder="Search..."
                value={filters.search}
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
            {isLoading && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              (table.getRowModel().rows?.length ? (
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
              ))}
          </TableBody>
        </Table>
      </div>

      {!isLoading && table.getRowModel().rows?.length && (
        <div className="flex flex-wrap justify-between items-center gap-2 p-4">
          <div className="pagination">
            <Pagination className="justify-normal">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={table.previousPage}
                    disabled={!table.getCanPreviousPage()}
                  />
                </PaginationItem>

                {Array.from({ length: charges.last_page }, (_, i) => i + 1).map(
                  (page, idx) => (
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
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={table.nextPage}
                    disabled={!table.getCanNextPage()}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>

          <div className="flex items-center gap-2 per-page">
            <label className="text-sm">Rows per page:</label>
            <Select
              onValueChange={(pageSize) =>
                table.setPageSize(parseInt(pageSize, 10))
              }
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
              {charges.from}-{charges.to}
              {charges.total ? ` of ${charges.total}` : ""}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingTable;
