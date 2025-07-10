"use client";

import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { useEffect, useState } from "react";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { columns, User } from "./columns";
import { useQuery } from "@tanstack/react-query";
import usersService from "@/services/users.service";
import { useRouter } from "next/navigation";
import UsersTableHeader from "./UsersTableHeader";
import UsersTableFilters from "./UsersTableFilters";
import UsersTableBody from "./UsersTableBody";
import UsersTablePagination from "./UsersTablePagination";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("users.list");
  const [search, setSearch] = useState("");

  // sorting, filters, and pagination state
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>(initialFilters);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: initialPagination?.pageIndex || 0,
    pageSize: initialPagination?.pageSize || 10,
  });
  // Initialize status filter state from initialFilters
  const initialStatusFilter = initialFilters.find(
    (f) => f.id === "status"
  )?.value;
  const [status, setStatus] = useState<string[]>(
    typeof initialStatusFilter === "string" && initialStatusFilter.length > 0
      ? initialStatusFilter.split(",")
      : []
  );

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
    columns: columns(t),
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
    const value = event.target.value;
    setSearch(value);
    table.setGlobalFilter(value);
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
      <Collapsible>
        <UsersTableHeader
          searchValue={search}
          onSearchChange={handleSearchChange}
        />
        <CollapsibleContent>
          <UsersTableFilters
            status={status}
            setStatus={setStatus}
            statusColumn={statusColumn}
            table={table}
          />
        </CollapsibleContent>
      </Collapsible>
      <UsersTableBody table={table} />
      <UsersTablePagination
        table={table}
        pages={pages}
        startRowIndex={startRowIndex}
        endRowIndex={endRowIndex}
        totalItems={totalItems}
      />
    </div>
  );
};

export default UsersTable;
