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
import { columns } from "./columns";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import numbersService from "@/services/numbers.service";
import { useLocale, useTranslations } from "@/providers/TranslationProvider";
import useAppStore from "@/store/app.slice";

interface DataTableProps {}

const DataTable = ({}: DataTableProps) => {
  const { setPageTitle } = useAppStore();

  const t = useTranslations("numbers");
  const tCommonSearch = useTranslations("common.search");
  const tCommonPagination = useTranslations("common.pagination");
  const locale = useLocale();

  useEffect(() => {
    setPageTitle(t("title"));

    // Cleanup when component unmounts
    return () => setPageTitle(null);
  }, [locale]);

  // sorting, filters, and pagination state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // client-side data fetching
  const { data = [] } = useLocalizedQuery({
    queryKey: ["numbers"],
    queryFn: numbersService.fetchNumbers,
  });

  // use data and initials to set up the table
  const table = useReactTable({
    data,
    columns: columns(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
      sorting,
      columnFilters,
    },
  });

  // pagination calculations
  const { pageIndex, pageSize } = table.getState().pagination;
  const totalItems = table.getFilteredRowModel().rows.length;
  const startRowIndex = pageIndex * pageSize + 1;
  const endRowIndex = Math.min((pageIndex + 1) * pageSize, totalItems);
  const pages = table.getPageCount()
    ? Array.from({ length: table.getPageCount() }, (_, i) => i + 1)
    : [];

  // callbacks
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    table.getColumn("number")?.setFilterValue(value);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="number-table-head flex flex-wrap items-center justify-between p-4">
        <h2>{t("title")}</h2>
        <div className="searchbar">
          <Field preIcon={<SearchIcon />}>
            <Input
              variant="field"
              placeholder={tCommonSearch("placeholder")}
              value={
                (table.getColumn("number")?.getFilterValue() as string) ?? ""
              }
              onChange={handleSearchChange}
              type="search"
            />
          </Field>
        </div>
      </div>

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
                  {tCommonSearch("noResults")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-wrap justify-between items-center gap-2 p-4">
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

        <div className="flex flex-wrap items-center gap-2 per-page">
          <label className="text-sm">{tCommonPagination("rowsPerPage")}:</label>
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
            {totalItems ? ` ${tCommonPagination("of")} ${totalItems}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
