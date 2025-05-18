"use client";
import { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDataTable } from "./data-table";
import {
  Pagination,
  PaginationButton,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";

const DataTablePagination = () => {
  const { table, pages } = useDataTable();

  return (
    <div className="flex justify-between items-center gap-2 p-4">
      <div className="pagination">
        <Pagination className="justify-normal">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              />
            </PaginationItem>

            {pages.map((page, idx) => (
              <div key={`page-${idx}`}>
                {page === -1 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                {page !== -1 && (
                  <PaginationItem>
                    <PaginationButton
                      isActive={
                        table.getState().pagination.pageIndex === page - 1
                      }
                      onClick={() => table.setPageIndex(page - 1)}
                    >
                      {page}
                    </PaginationButton>
                  </PaginationItem>
                )}
              </div>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <div className="flex items-center gap-2 per-page">
        <label className="text-sm">Rows per page:</label>
        <Select
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
          defaultValue="10"
        >
          <SelectTrigger className="w-max">
            <SelectValue placeholder="10" defaultValue="10" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="30">30</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DataTablePagination;
