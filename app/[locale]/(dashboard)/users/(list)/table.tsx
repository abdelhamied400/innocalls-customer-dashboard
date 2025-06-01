"use client";

import {
  Column,
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
import { Button } from "@/components/ui/button";
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
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { Toggle } from "@/components/ui/toggle";
import { Clear } from "@mui/icons-material";
import FilterDialog from "@/components/FilterDialog";
import { Badge } from "@/components/ui/badge";
import { userStatuses } from "@/constants/user";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { columns, User } from "./columns";
import { getPinningLeftStyles } from "@/lib/table";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import usersService from "@/services/users.service";
import { useRouter } from "next/navigation";
import { debounce } from "@/lib/debounce";

interface UsersTableProps {
  initialData: User[];
  initialPagination?: {
    pageIndex: number;
    pageSize: number;
  };
  initialFilters?: ColumnFiltersState;
  initialSorting?: SortingState;
}

const UsersTable = ({
  initialData,
  initialFilters = [],
  initialSorting = [],
  initialPagination,
}: UsersTableProps) => {
  const router = useRouter();

  // sorting, filters, and pagination state
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>(initialFilters);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: initialPagination?.pageIndex || 0,
    pageSize: initialPagination?.pageSize || 10,
  });
  const [status, setStatus] = useState<string[]>([]);

  // client-side data fetching
  const { data } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: usersService.getUsers,
    initialData,
    refetchInterval(query) {
      // refetch every 3 seconds if there are pending users
      const hasPending =
        !!query.state.data &&
        query.state.data.length > 0 &&
        query.state.data.some((user) => user.status === "pending");

      return hasPending ? 3000 : false;
    },
  });

  // use data and initials to set up the table
  const table = useReactTable({
    data,
    columns,
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
  const statusColumn = table.getColumn("status");
  const searchValue = (nameColumn?.getFilterValue() as string) || "";
  const statusValue = (statusColumn?.getFilterValue() as string) || "";

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

    debounce(() => {
      router.push(`?${params.toString()}`);
    }, 5000);
  }, [pageIndex, pageSize, columnFilters, tableSorting, router]);

  return (
    <div className="flex flex-col gap-0 h-full border rounded-xl">
      <Collapsible>
        <div className="users-table-head flex items-center justify-between p-4">
          <h2>Users List</h2>
          <div className="actions flex items-center gap-2">
            <Field preIcon={<SearchIcon />}>
              <Input
                variant="field"
                placeholder="Search..."
                value={searchValue}
                onChange={handleSearchChange}
                type="search"
              />
            </Field>
            <CollapsibleTrigger asChild>
              <Toggle pressed={true} className="rounded-full">
                <FilterAltIcon />
              </Toggle>
            </CollapsibleTrigger>
            <Link href="/users/create">
              <Button>Create new user</Button>
            </Link>
          </div>
        </div>

        <CollapsibleContent>
          <div className="flex justify-between items-center p-3 border-t table-filters">
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="filter" size="filter">
                    Status
                    {statusValue.split(",").length > 0 && (
                      <Badge
                        variant="outline"
                        className="bg-neutral-500 px-1.5 rounded-md text-white"
                      >
                        {statusValue.split(",").length}
                      </Badge>
                    )}
                    <ChevronDownIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <FilterDialog
                    title="Select from the list"
                    onReset={() => {
                      statusColumn?.setFilterValue("");
                      setStatus([]);
                    }}
                    onApply={() => {
                      statusColumn?.setFilterValue(status.join(","));
                    }}
                  >
                    <RadioGroup
                      defaultValue=""
                      onValueChange={(value: string) => {
                        if (value === "") {
                          setStatus([]);
                        } else {
                          setStatus(value.split(","));
                        }
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
                table.resetColumnFilters();
                table.setSorting([]);
                setStatus([]);
              }}
              variant="ghost"
            >
              <Clear /> Clear
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="flex-1 h-full overflow-y-auto">
        <Table className="min-h-full w-full">
          <TableHeader className="bg-gray-100 sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={
                        header.id === "ext"
                          ? getPinningLeftStyles(header.column)
                          : {}
                      }
                      className="bg-gray-100"
                    >
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
                    <TableCell
                      key={cell.id}
                      style={
                        cell.column.id === "ext"
                          ? getPinningLeftStyles(cell.column)
                          : {}
                      }
                      className={"bg-white"}
                    >
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

export default UsersTable;
