"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePaginatedTable } from "./PaginatedTable";
import {
  Pagination,
  PaginationButton,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import usePagination from "./usePagination";
import { useTranslations } from "@/providers/TranslationProvider";

const PaginatedTablePagination = () => {
  const { table, pagination } = usePaginatedTable();
  const { startRowIndex, endRowIndex, totalItems, pages } = usePagination(
    table,
    {
      isManualPagination: table.options.manualPagination,
    }
  );

  const t = useTranslations("common.pagination");

  const handlePerPageChange = (value: string) => {
    table.setPageSize(Number(value));
  };
  const handlePageChange = (page: number) => {
    table.setPageIndex(page - 1);
  };

  return (
    <div className="flex flex-wrap justify-between items-center gap-2 p-4">
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
              <PaginationItem key={`page-${page}, ${idx}`}>
                {page === -1 && <PaginationEllipsis />}
                {page !== -1 && (
                  <PaginationButton
                    isActive={
                      table.getState().pagination.pageIndex + 1 === page
                    }
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </PaginationButton>
                )}
              </PaginationItem>
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

      <div className="flex flex-wrap items-center gap-2 per-page">
        <label className="text-sm">{t("rowsPerPage")}:</label>
        <Select
          onValueChange={handlePerPageChange}
          defaultValue={pagination?.pageSize?.toString()}
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
          {totalItems ? ` ${t("of")} ${totalItems}` : ""}
        </p>
      </div>
    </div>
  );
};

export default PaginatedTablePagination;
