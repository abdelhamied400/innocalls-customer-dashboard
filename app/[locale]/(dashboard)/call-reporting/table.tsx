"use client";

import callReportingService from "@/services/call-reporting.service";
import { Call, CallReportingFilters } from "@/types/api/call-reporting";
import { Paginated } from "@/types/shared/paginated";
import { useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import Field from "@/components/ui/field";
import { FilterAltOutlined, Search } from "@mui/icons-material";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
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
import { Button } from "@/components/ui/button";
import { Calendar, ChevronDownIcon } from "lucide-react";
import FilterDialog from "@/components/FilterDialog";
import DatePicker from "@/components/ui/date-picker";
import { format } from "date-fns";
import { useFilters } from "@/hooks/use-filters";
import useVocabStore from "@/store/vocab.slice";

type CallReportingTableProps = {
  initialData: Paginated<Call>;
  initialPagination?: {
    pageIndex: number;
    pageSize: number;
  };
  initialFilters?: CallReportingFilters;
  initialSorting?: SortingState;
};

// 30 days ago
const initialFromDate = new Date();
initialFromDate.setDate(initialFromDate.getDate() - 30);
// today
const initialToDate = new Date();

const CallReportingTable = ({
  initialData,
  initialFilters = {},
  initialSorting = [],
  initialPagination,
}: CallReportingTableProps) => {
  const router = useRouter();
  const { updateFilters } = useFilters();
  const { extensions, tags } = useVocabStore();
  const [filters, setFilters] = useState<CallReportingFilters>({
    ...initialFilters,
    fromDate: initialFilters.fromDate
      ? new Date(initialFilters.fromDate)
      : initialFromDate,
    toDate: initialFilters.toDate
      ? new Date(initialFilters.toDate)
      : initialToDate,
  });

  const [pagesCount, setPagesCount] = useState<number>(initialData.last_page);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: initialPagination?.pageIndex || 0,
    pageSize: initialPagination?.pageSize || 10,
  });

  // Initialize the query to fetch call reporting data
  const {
    data: callReporting,
    isFetching,
    isPlaceholderData,
    refetch,
  } = useQuery({
    queryKey: ["call-reporting", pagination.pageIndex, pagination.pageSize],
    queryFn: async () =>
      await callReportingService.getCallReporting(
        pagination.pageIndex + 1,
        pagination.pageSize,
        filters
      ),
    placeholderData: initialData,
  });

  const table = useReactTable({
    data: callReporting?.data || [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
    manualPagination: true,
    pageCount: callReporting?.last_page || 0,
    state: {
      pagination,
    },
  });

  // Update the pages count when callReporting data changes
  useEffect(() => {
    if (!isPlaceholderData && callReporting?.last_page) {
      setPagesCount(callReporting.last_page);
    }
  }, [isPlaceholderData, callReporting]);

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
    });
  }, [pageIndex, pageSize, router]);

  return (
    <div className="h-full flex flex-col">
      {/* header and filters */}
      <Collapsible>
        <div className="call-reporting-table-head flex items-center justify-between p-4">
          <h2>Call Reporting</h2>
          <div className="flex items-center gap-2">
            <div className="searchbar">
              <Field preIcon={<Search />}>
                <Input variant="field" placeholder="Search..." type="search" />
              </Field>
            </div>
            <div className="actions flex items-center gap-2">
              <CollapsibleTrigger asChild>
                <Toggle pressed={true} className="rounded-full">
                  <FilterAltOutlined />
                </Toggle>
              </CollapsibleTrigger>
            </div>
          </div>
        </div>
        <CollapsibleContent className="border-t p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="filter" size="filter">
                Call Date
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <FilterDialog
                title="Select a date range"
                onReset={() => {
                  setFilters({
                    fromDate: initialFromDate,
                    toDate: initialToDate,
                  });
                  updateFilters({
                    fromDate: format(initialFromDate, "yyyy-MM-dd"),
                    toDate: format(initialToDate, "yyyy-MM-dd"),
                  });
                  setTimeout(() => {
                    refetch();
                  }, 0);
                }}
                onApply={() => {
                  updateFilters({
                    fromDate: filters.fromDate
                      ? format(filters.fromDate, "yyyy-MM-dd")
                      : format(initialFromDate, "yyyy-MM-dd"),
                    toDate: filters.toDate
                      ? format(filters.toDate, "yyyy-MM-dd")
                      : format(initialToDate, "yyyy-MM-dd"),
                  });
                  refetch();
                }}
              >
                <Field
                  label="From"
                  hint="DD/MM/YYYY"
                  postIcon={<Calendar className="text-gray-400" />}
                >
                  <DatePicker
                    className="flex-1"
                    placeholder="Enter from date"
                    value={filters.fromDate}
                    onChange={(date) => {
                      setFilters((prev) => ({
                        ...prev,
                        fromDate: date || undefined,
                      }));
                    }}
                  />
                </Field>
                <Field
                  label="To"
                  hint="DD/MM/YYYY"
                  postIcon={<Calendar className="text-gray-400" />}
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="filter" size="filter">
                Source
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <FilterDialog
                title="Filter by Source Extensions"
                onReset={() => {
                  setFilters((prev) => ({
                    ...prev,
                    sourceExtensions: undefined,
                  }));
                  updateFilters({ sourceExtensions: undefined });
                  setTimeout(() => {
                    refetch();
                  }, 0);
                }}
                onApply={() => {
                  updateFilters({
                    sourceExtensions: filters.sourceExtensions,
                  });
                  refetch();
                }}
              >
                <Select
                  value={filters.sourceExtensions}
                  onValueChange={(value) => {
                    setFilters((prev) => ({
                      ...prev,
                      sourceExtensions: value || undefined,
                    }));
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select source extensions" />
                  </SelectTrigger>
                  <SelectContent>
                    {extensions.map((ext) => (
                      <SelectItem key={ext.id} value={ext.ext}>
                        {ext.name} ({ext.ext})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FilterDialog>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* destination filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="filter" size="filter">
                Destination
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <FilterDialog
                title="Filter by Destination Extensions"
                onReset={() => {
                  setFilters((prev) => ({
                    ...prev,
                    destinationExtensions: undefined,
                  }));
                  updateFilters({ destinationExtensions: undefined });
                  setTimeout(() => {
                    refetch();
                  }, 0);
                }}
                onApply={() => {
                  updateFilters({
                    destinationExtensions: filters.destinationExtensions,
                  });
                  refetch();
                }}
              >
                <Select
                  value={filters.destinationExtensions}
                  onValueChange={(value) => {
                    setFilters((prev) => ({
                      ...prev,
                      destinationExtensions: value || undefined,
                    }));
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select destination extensions" />
                  </SelectTrigger>
                  <SelectContent>
                    {extensions.map((ext) => (
                      <SelectItem key={ext.id} value={ext.ext}>
                        {ext.name} ({ext.ext})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FilterDialog>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* tags filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="filter" size="filter">
                Tags
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <FilterDialog
                title="Filter by Tags"
                onReset={() => {
                  setFilters((prev) => ({
                    ...prev,
                    tags: undefined,
                  }));
                  updateFilters({ tags: undefined });
                  setTimeout(() => {
                    refetch();
                  }, 0);
                }}
                onApply={() => {
                  updateFilters({
                    tags: filters.tags,
                  });
                  refetch();
                }}
              >
                <Select
                  value={filters.tags}
                  onValueChange={(value) => {
                    setFilters((prev) => ({
                      ...prev,
                      tags: value || undefined,
                    }));
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select tags" />
                  </SelectTrigger>
                  <SelectContent>
                    {tags.map((tag) => (
                      <SelectItem key={tag.id} value={tag.nameEN}>
                        {tag.nameEN}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FilterDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </CollapsibleContent>
      </Collapsible>

      {/* table body */}
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

          {isFetching && (
            <TableBody>
              {Array.from({ length: 10 }, (_, index) => (
                <TableRow key={index}>
                  {Array.from({ length: columns.length }, (_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          )}

          {!isFetching && (
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
          )}
        </Table>
      </div>

      {/* pagination */}
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
            onValueChange={(value) => table.setPageSize(Number(value))}
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

export default CallReportingTable;
