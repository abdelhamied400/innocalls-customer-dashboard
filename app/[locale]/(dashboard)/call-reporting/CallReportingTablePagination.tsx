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

interface CallReportingTablePaginationProps {
  table: any;
  lastPage: number;
  from: number;
  to: number;
  total: number;
}

const CallReportingTablePagination = ({
  table,
  lastPage,
  from,
  to,
  total,
}: CallReportingTablePaginationProps) => (
  <div className="flex flex-wrap justify-between items-center gap-2 p-4">
    <div className="pagination">
      <Pagination className="justify-normal">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={table.previousPage}
              disabled={!table.getCanPreviousPage()}
            />
          </PaginationItem>
          {Array.from({ length: lastPage }, (_, i) => i + 1).map(
            (page, idx) => (
              <PaginationItem key={`page-${page}-${idx}`}>
                <PaginationButton
                  isActive={table.getState().pagination.pageIndex + 1 === page}
                  onClick={() => table.setPageIndex(page - 1)}
                >
                  {page}
                </PaginationButton>
              </PaginationItem>
            )
          )}
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
        onValueChange={(pageSize) => table.setPageSize(parseInt(pageSize, 10))}
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
        {from}-{to}
        {total ? ` of ${total}` : ""}
      </p>
    </div>
  </div>
);

export default CallReportingTablePagination;
