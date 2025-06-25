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
import { SearchIcon } from "lucide-react";
import { columns, MonitorUser } from "./columns";
import { useQuery } from "@tanstack/react-query";
import usersService from "@/services/users.service";
import UsersLoading from "./loading";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import MonitorUsersHead from "./head";
import PaginatedTable from "@/components/Table/PaginatedTable";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import { isAxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";

type UsersMonitorFilters = {};

const defaultFilters: UsersMonitorFilters = {
  search: "",
};

const UsersMonitorTable = ({}) => {
  const { toast } = useToast();
  const t = useTranslations("users.monitor");

  const [filters, setFilters] = useState<UsersMonitorFilters>(defaultFilters);

  const {
    data = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["monitor-users", filters],
    queryFn: async () => usersService.getUsersMonitor(),
    refetchInterval: 30000,
  });

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
    <div className="flex flex-col gap-0 h-full border rounded-xl">
      <PaginatedTable
        data={data || []}
        columns={columns(t)}
        manualPagination={false}
      >
        <MonitorUsersHead filters={filters} setFilters={setFilters} />

        <PaginatedTableContent>
          <PaginatedTableHead />
          {isLoading && <PaginatedTableSkeleton />}
          {!isLoading && <PaginatedTableBody />}
        </PaginatedTableContent>
        {!isLoading && <PaginatedTablePagination />}
      </PaginatedTable>
      {/* 
      <div className="flex-1 overflow-y-auto">
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
                  {searchT("noResults")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-center gap-2 p-4">
        <div className="pagination">
          <Pagination className="justify-normal">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={table.previousPage}
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
                  onClick={table.nextPage}
                  disabled={!table.getCanNextPage()}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        <div className="flex items-center gap-2 per-page">
          <label className="text-sm">{paginationT("rowsPerPage")}:</label>
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
            {totalItems ? ` ${paginationT("of")} ${totalItems}` : ""}
          </p>
        </div>
      </div> */}
    </div>
  );
};

export default UsersMonitorTable;
