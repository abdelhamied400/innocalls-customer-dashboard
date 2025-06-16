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

// 30 days ago
const fromDate = new Date();
fromDate.setDate(fromDate.getDate() - 30);
// today
const toDate = new Date();

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
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filters, setFilters] = useState<InvoicesFilters>({
    search: "",
    fromDate: fromDate,
    toDate: toDate,
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
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["invoices", pagination, sorting],
    queryFn: async () =>
      await billingService.getInvoicesList(
        pagination.pageIndex + 1,
        pagination.pageSize,
        {
          search: filters.search,
          ...(filters.fromDate && {
            fromDate: format(filters.fromDate, "yyyy-MM-dd"),
          }),
          ...(filters.toDate && {
            toDate: format(filters.toDate, "yyyy-MM-dd"),
          }),
          ...(filters.fromTotal && { fromTotal: filters.fromTotal }),
          ...(filters.toTotal && { toTotal: filters.toTotal }),
          status: filters.status,
        },
        sorting
      ),
  });

  const table = useReactTable({
    data: invoices.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    pageCount: invoices.last_page,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
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

  const applyFilters = () => {
    let isValid = true;
    isValid = isValidDateRange(
      filters.fromDate,
      filters.toDate,
      (message) => {
        toast({
          title: "Invalid date range",
          description: message,
          variant: "destructive",
        });
      },
      -1
    );

    // Validate amount range
    if (
      !!filters.fromTotal &&
      !!filters.toTotal &&
      Number(filters.fromTotal) > Number(filters.toTotal)
    ) {
      isValid = false;
      toast({
        title: "Invalid Amount Range",
        description: "From amount must be less than to amount.",
        variant: "destructive",
      });
      return;
    }

    if (!isValid) return;
    // If valid, refetch the data
    refetch();
  };

  return (
    <div className="h-full flex flex-col border rounded-xl">
      <Collapsible>
        <div className="table-head flex items-center justify-between p-4">
          <h2>Invoices</h2>
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
        <CollapsibleContent>
          <FilterBar
            onClear={() => {
              setFilters({
                search: "",
                fromDate: fromDate,
                toDate: toDate,
                fromTotal: "",
                toTotal: "",
                status: null,
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
                postIcon={<CalendarMonth className="text-gray-400" />}
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
                postIcon={<CalendarMonth className="text-gray-400" />}
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
              triggerLabel="Amount"
              label="Search by amount"
              onReset={() => {
                setFilters((prev) => ({
                  ...prev,
                  fromTotal: "",
                  toTotal: "",
                }));
                setTimeout(() => {
                  refetch();
                }, 0);
              }}
              onApply={applyFilters}
            >
              <Field label="From Amount">
                <Input
                  variant="field"
                  type="number"
                  placeholder="Enter from amount..."
                  value={filters.fromTotal}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      fromTotal: e.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="To Amount">
                <Input
                  variant="field"
                  type="number"
                  placeholder="Enter to amount..."
                  value={filters.toTotal}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      toTotal: e.target.value,
                    }))
                  }
                />
              </Field>
            </FilterBox>
            <FilterBox
              triggerLabel="Status"
              label="Select invoice status"
              onReset={() => {
                setFilters((prev) => ({ ...prev, status: null }));
                setTimeout(() => {
                  refetch();
                }, 0);
              }}
              onApply={applyFilters}
            >
              <RadioGroup
                onValueChange={(status) =>
                  setFilters((prev) => ({
                    ...prev,
                    status: status as InvoicesFilters["status"],
                  }))
                }
                value={filters.status}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="draft" id="draft" />
                  <Label htmlFor="draft">Draft</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="overdue" id="overdue" />
                  <Label htmlFor="overdue">Overdue</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paid" id="paid" />
                  <Label htmlFor="paid">Paid</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="partially_paid" id="partially_paid" />
                  <Label htmlFor="partially_paid">Partially Paid</Label>
                </div>
              </RadioGroup>
            </FilterBox>
          </FilterBar>
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
            {isFetching && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {!isFetching &&
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
      {!isFetching && table.getRowModel().rows?.length > 0 && (
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

                {Array.from(
                  { length: invoices.last_page },
                  (_, i) => i + 1
                ).map((page, idx) => (
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
              {invoices.from}-{invoices.to}
              {invoices.total ? ` of ${invoices.total}` : ""}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingTable;
