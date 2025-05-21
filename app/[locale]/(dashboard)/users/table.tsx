"use client";

import {
  ColumnDef,
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
import { ChevronDownIcon, SearchIcon } from "lucide-react";
import { useFilters } from "@/hooks/use-filters";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import DatePicker from "@/components/ui/date-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { Toggle } from "@/components/ui/toggle";
import { Clear } from "@mui/icons-material";
import FilterDialog from "@/components/FilterDialog";
import { Badge } from "@/components/ui/badge";
import { userStatuses } from "@/constants/user";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface UsersTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  initialPagination?: PaginationState;
  initialFilters?: ColumnFiltersState;
}

const UsersTable = <TData, TValue>({
  columns,
  data,
  initialPagination,
  initialFilters = [],
}: UsersTableProps<TData, TValue>) => {
  const { pageIndex = 1, pageSize = 10 } = initialPagination || {};
  const { updateFilters, clearAllFilters, clearGroup, getFilterCountForGroup } =
    useFilters();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>(initialFilters);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex,
    pageSize,
  });

  const [status, setStatus] = useState<string[]>(
    (initialFilters.find((f) => f.id === "status")?.value as string[]) || []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      pagination,
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

  const handlePageChange = (page: number) => {
    table.setPageIndex(page - 1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    table.getColumn("name")?.setFilterValue(name);
    updateFilters(
      {
        name: name,
      },
      { silent: true }
    );
  };

  useEffect(() => {
    updateFilters(
      {
        page: String(pagination.pageIndex + 1),
        pageSize: String(pagination.pageSize),
      },
      { silent: true }
    );
  }, [pagination.pageIndex, pagination.pageSize, updateFilters]);

  const pages = table.getPageCount()
    ? Array.from({ length: table.getPageCount() }, (_, i) => i + 1)
    : [];

  return (
    <div className="rounded-xl border">
      <Collapsible>
        <div className="users-table-head flex items-center justify-between p-4">
          <h2>Users List</h2>
          <div className="actions flex items-center gap-2">
            <Field preIcon={<SearchIcon />}>
              <Input
                variant="field"
                placeholder="Search..."
                value={
                  (table.getColumn("name")?.getFilterValue() as string) ?? ""
                }
                onChange={handleSearchChange}
                type="search"
              />
            </Field>
            <CollapsibleTrigger asChild>
              <Toggle pressed={true} className="rounded-full">
                <FilterAltIcon />
              </Toggle>
            </CollapsibleTrigger>
            <Button>Create new user</Button>
          </div>
        </div>

        <CollapsibleContent>
          <div className="flex justify-between items-center p-3 border-t table-filters">
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="filter" size="filter">
                    Status
                    {status.length > 0 && (
                      <Badge
                        variant="outline"
                        className="bg-neutral-500 px-1.5 rounded-md text-white"
                      >
                        {status.length}
                      </Badge>
                    )}
                    <ChevronDownIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <FilterDialog
                    title="Select from the list"
                    onReset={() => {
                      table.getColumn("status")?.setFilterValue("");
                      setStatus([]);
                      clearGroup("status");
                    }}
                    onApply={() => {
                      table
                        .getColumn("status")
                        ?.setFilterValue(status.join(","));
                      updateFilters(
                        {
                          status: status.join(","),
                        },
                        { silent: true }
                      );
                    }}
                  >
                    <RadioGroup
                      defaultValue=""
                      onValueChange={(value: string) => {
                        setStatus([value]);
                      }}
                      value={status.length === 1 ? status[0] : ""}
                    >
                      {userStatuses.map((s) => (
                        <div
                          className="flex items-center space-x-2"
                          key={s.value}
                        >
                          <RadioGroupItem value={s.value} id={s.value} />
                          <Label htmlFor={s.value}>{s.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FilterDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Button
              onClick={() => {
                clearAllFilters();
                table.resetColumnFilters();
                setStatus([]);
              }}
              variant="ghost"
            >
              <Clear /> Clear
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Table>
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
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center gap-2 p-4">
        <div className="pagination">
          <Pagination className="justify-normal">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => {
                    table.previousPage();
                    handlePageChange(table.getState().pagination.pageIndex - 1);
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
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </PaginationButton>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => {
                    table.nextPage();
                    handlePageChange(table.getState().pagination.pageIndex + 1);
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

export default UsersTable;
