"use client";

import { OneTimeReport, OneTimeReportFilters } from "@/types/api/report";
import { PaginationState } from "@tanstack/react-table";
import { useState } from "react";
import { columns } from "./columns";
import PaginatedTable from "@/components/Table/PaginatedTable";
import OneTimeReportHead from "./head";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";

const defaultFilters: OneTimeReportFilters = {};

// Mock data for development - replace with actual API call when available
const mockData: OneTimeReport[] = [
  {
    id: "1",
    createdAt: "2024-01-15 09:30:00",
    report: "Monthly Sales Report",
    recipients: ["john@example.com", "jane@example.com"],
  },
  {
    id: "2",
    createdAt: "2024-01-14 14:15:00",
    report: "Weekly Call Analytics",
    recipients: ["manager@example.com"],
  },
  {
    id: "3",
    createdAt: "2024-01-13 11:00:00",
    report: "Agent Performance Summary",
    recipients: ["hr@example.com", "supervisor@example.com", "admin@example.com"],
  },
  {
    id: "4",
    createdAt: "2024-01-12 16:45:00",
    report: "Customer Satisfaction Report",
    recipients: ["quality@example.com"],
  },
  {
    id: "5",
    createdAt: "2024-01-11 08:00:00",
    report: "Queue Statistics Report",
    recipients: ["operations@example.com", "team-lead@example.com"],
  },
];

const OneTimeReportTable = () => {
  const [filters, setFilters] = useState<OneTimeReportFilters>({
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
        <OneTimeReportHead filters={filters} setFilters={setFilters} />
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

export default OneTimeReportTable;
