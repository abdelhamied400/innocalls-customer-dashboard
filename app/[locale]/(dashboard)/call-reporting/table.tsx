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
import { SearchIcon } from "lucide-react";
import { columns } from "./columns";
import { useQuery } from "@tanstack/react-query";
import callReportingService from "@/services/call-reporting.service";
import { Button } from "@/components/ui/button";
import { CallReportingFilters } from "@/types/api/call-reporting";
import { useToast } from "@/hooks/use-toast";
import { isAxiosError } from "axios";
import { useSession } from "next-auth/react";

const CallReportingTable = () => {
  const { toast } = useToast();
  const session = useSession();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filters, setFilters] = useState<CallReportingFilters>({
    search: "",
    sourceExtensions: "",
    destinationExtensions: "",
    fromDate: undefined,
    toDate: undefined,
    callStatuses: "",
    tags: "",
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: callReporting = {
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
    queryKey: [
      "call-reporting",
      pagination.pageIndex,
      pagination.pageSize,
      filters,
    ],
    queryFn: async () =>
      await callReportingService.getCallReporting(
        pagination.pageIndex + 1,
        pagination.pageSize,
        filters
      ),
  });

  const table = useReactTable({
    data: callReporting.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    pageCount: callReporting.last_page,
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

  const handleExport = async () => {
    if (!session.data) return;
    try {
      await callReportingService.exportCallReporting({
        ...filters,
        userEmail: session.data.user.email,
      });
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

  return (
    <div className="h-full flex flex-col">
      <div className="users-table-head flex items-center justify-between p-4">
        <h2>Call Reporting</h2>
        <div className="actions flex items-center gap-2">
          <Field preIcon={<SearchIcon />}>
            <Input
              variant="field"
              placeholder="Search..."
              value={filters.search}
              onChange={handleSearchChange}
              type="search"
            />
          </Field>
          <Button onClick={handleExport}>Export</Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <Table className="min-h-full w-full">
          <TableHeader className="bg-gray-100 sticky -top-2 z-10">
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

                {Array.from(
                  { length: callReporting.last_page },
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
              {callReporting.from}-{callReporting.to}
              {callReporting.total ? ` of ${callReporting.total}` : ""}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallReportingTable;
