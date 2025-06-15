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

type UsersMonitorTableProps = {
  initialData: MonitorUser[];
  initialPagination?: {
    pageIndex: number;
    pageSize: number;
  };
  initialFilters?: ColumnFiltersState;
  initialSorting?: SortingState;
};
const UsersMonitorTable = ({
  initialData,
  initialFilters = [],
  initialSorting = [],
  initialPagination,
}: UsersMonitorTableProps) => {
  const router = useRouter();
  const t = useTranslations("users.monitor");
  const searchT = useTranslations("common.search");
  const paginationT = useTranslations("common.pagination");

  // sorting, filters, and pagination state
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>(initialFilters);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: initialPagination?.pageIndex || 0,
    pageSize: initialPagination?.pageSize || 10,
  });

  const { data = [], isLoading } = useQuery({
    queryKey: ["monitor-users"],
    queryFn: async () => usersService.getUsersMonitor(),
    initialData,
    refetchInterval: 30000,
  });

  const table = useReactTable({
    data,
    columns: columns(t),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    autoResetAll: false,
    state: {
      pagination,
      sorting,
      columnFilters,
    },
  });

  // sorting calculations
  const tableSorting = table.getState().sorting;

  // pagination calculations
  const { pageIndex, pageSize } = table.getState().pagination;
  const totalItems = table.getFilteredRowModel().rows.length;
  const startRowIndex = pageIndex * pageSize + 1;
  const endRowIndex = Math.min((pageIndex + 1) * pageSize, totalItems);
  const pages = table.getPageCount()
    ? Array.from({ length: table.getPageCount() }, (_, i) => i + 1)
    : [];

  // filters calculations
  const nameColumn = table.getColumn("name");
  const searchValue = (nameColumn?.getFilterValue() as string) || "";

  // Callbacks
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    table.getColumn("name")?.setFilterValue(name);
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

    router.push(`?${params.toString()}`);
  }, [pageIndex, pageSize, columnFilters, tableSorting, router]);

  return (
    <div className="flex flex-col gap-0 h-full border rounded-xl">
      <div className="users-table-head flex items-center justify-between p-4">
        <h2>{t("title")}</h2>
        <div className="actions flex items-center gap-2">
          <Field preIcon={<SearchIcon />}>
            <Input
              variant="field"
              placeholder={searchT("placeholder")}
              value={searchValue}
              onChange={handleSearchChange}
              type="search"
            />
          </Field>
        </div>
      </div>

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
      </div>
    </div>
  );
};

export default UsersMonitorTable;
