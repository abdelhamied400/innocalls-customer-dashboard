"use client";

import { flexRender, Header } from "@tanstack/react-table";
import { TableHead, TableHeader, TableRow } from "../ui/table";
import { usePaginatedTable } from "./PaginatedTable";
import { cn } from "@/lib/utils";
import { RowData } from "@tanstack/react-table";

const PaginatedTableHead = () => {
  const { table } = usePaginatedTable();
  return (
    <TableHeader className="bg-gray-100 sticky top-0 z-20">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            return (
              <TableHead key={header.id} colSpan={header.colSpan}>
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
  );
};

export default PaginatedTableHead;
