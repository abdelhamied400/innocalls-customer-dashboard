"use client";

import { useState } from "react";
import { columns } from "./columns";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import ticketsService, { Ticket, TicketFilters } from "@/services/tickets.service";
import TicketsTableHeader from "./head";
import { useTranslations } from "@/providers/TranslationProvider";
import PaginatedTable from "@/components/Table/PaginatedTable";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import { PaginationState } from "@tanstack/react-table";

const TicketsTable = () => {
  const [filters, setFilters] = useState<TicketFilters>({
    page: 1,
    perPage: 10,
  });

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const t = useTranslations("innoSupport.list");

  const { data, isLoading } = useLocalizedQuery<{
    data: Ticket[];
    last_page: number;
  }>({
    queryKey: ["tickets", filters],
    queryFn: () =>
      ticketsService.getTickets({
        ...filters,
        page: pagination.pageIndex + 1,
        perPage: pagination.pageSize,
      }),
  });

  const handlePaginationChange = (newPagination: PaginationState) => {
    setPagination(newPagination);
    setFilters((prev) => ({
      ...prev,
      page: newPagination.pageIndex + 1,
      perPage: newPagination.pageSize,
    }));
  };

  const handleFiltersChange: React.Dispatch<React.SetStateAction<TicketFilters>> = (
    updater
  ) => {
    setFilters(updater);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  return (
    <div className="flex flex-col gap-0 h-full border rounded-xl">
      <PaginatedTable
        data={data?.data || []}
        columns={columns(t)}
        manualPagination={true}
        pagination={{
          totalItems: (data?.last_page || 1) * pagination.pageSize,
          totalPages: data?.last_page || 1,
        }}
        paginationState={pagination}
        onPaginationChange={handlePaginationChange}
      >
        <TicketsTableHeader filters={filters} setFilters={handleFiltersChange} />
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

export default TicketsTable;
