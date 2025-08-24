"use client";

import { useState } from "react";
import { columns, User } from "./columns";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import usersService from "@/services/users.service";
import UsersTableHeader from "./head";
import { useTranslations } from "next-intl";
import PaginatedTable from "@/components/Table/PaginatedTable";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";

interface UsersTableProps {}

const UsersTable = ({}: UsersTableProps) => {
  const [filters, setFilters] = useState<Record<string, any>>({
    name: "",
    status: "",
  });

  // client-side data fetching
  const t = useTranslations("users.list");

  const { data = [], isLoading } = useLocalizedQuery<User[]>({
    queryKey: ["users", filters],
    queryFn: usersService.getUsers,
    refetchInterval(query) {
      // refetch every 3 seconds if there are pending users
      const hasPending =
        !!query.state.data &&
        query.state.data.length > 0 &&
        query.state.data.some((user) => user.status === "pending");

      return hasPending ? 3000 : false;
    },
  });

  return (
    <div className="flex flex-col gap-0 h-full border rounded-xl">
      <PaginatedTable
        data={data || []}
        columns={columns(t)}
        manualPagination={false}
      >
        <UsersTableHeader filters={filters} setFilters={setFilters} />
        <PaginatedTableContent>
          <PaginatedTableHead />
          {isLoading && <PaginatedTableSkeleton />}
          {!isLoading && <PaginatedTableBody />}
        </PaginatedTableContent>
        {!isLoading && <PaginatedTablePagination />}
      </PaginatedTable>
    </div>
  );
};

export default UsersTable;
