"use client";

import { ScheduledReport, ScheduledReportFilters } from "@/types/api/report";
import { PaginationState } from "@tanstack/react-table";
import { useState } from "react";
import { columns } from "./columns";
import PaginatedTable from "@/components/Table/PaginatedTable";
import ScheduledReportHead from "./head";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";

export const defaultFilters: ScheduledReportFilters = {};

// Mock data for development - replace with actual API call when available
const mockData: ScheduledReport[] = [
  {
    id: "1",
    createdAt: "2024-01-15 09:30:00",
    name: "Daily Sales Report",
    scheduled: "daily",
    status: "active",
    nextGeneration: "2024-01-16 09:00:00",
    recipients: ["john@example.com", "jane@example.com"],
  },
  {
    id: "2",
    createdAt: "2024-01-14 14:15:00",
    name: "Weekly Call Analytics",
    scheduled: "weekly",
    status: "active",
    nextGeneration: "2024-01-21 09:00:00",
    recipients: ["manager@example.com"],
  },
  {
    id: "3",
    createdAt: "2024-01-13 11:00:00",
    name: "Monthly Performance Summary",
    scheduled: "monthly",
    status: "inactive",
    nextGeneration: "2024-02-01 09:00:00",
    recipients: ["hr@example.com", "supervisor@example.com", "admin@example.com"],
  },
  {
    id: "4",
    createdAt: "2024-01-12 16:45:00",
    name: "Daily Queue Statistics",
    scheduled: "daily",
    status: "active",
    nextGeneration: "2024-01-16 08:00:00",
    recipients: ["operations@example.com"],
  },
  {
    id: "5",
    createdAt: "2024-01-11 08:00:00",
    name: "Weekly Agent Report",
    scheduled: "weekly",
    status: "inactive",
    nextGeneration: "2024-01-18 09:00:00",
    recipients: ["team-lead@example.com", "manager@example.com"],
  },
];

const ScheduledReportTable = () => {
  const [filters, setFilters] = useState<ScheduledReportFilters>({
    ...defaultFilters,
  });

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // TODO: Replace with actual API call when available
  const isLoading = false;
  const data = mockData;

  return (
    <div className="h-full flex flex-col">
      <PaginatedTable
        data={data}
        columns={columns()}
        pagination={{
          totalItems: data.length,
          totalPages: Math.ceil(data.length / pagination.pageSize) || 1,
          from: pagination.pageIndex * pagination.pageSize + 1,
          to: Math.min(
            (pagination.pageIndex + 1) * pagination.pageSize,
            data.length
          ),
        }}
        paginationState={pagination}
        onPaginationChange={setPagination}
      >
        <ScheduledReportHead filters={filters} setFilters={setFilters} />
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

export default ScheduledReportTable;
