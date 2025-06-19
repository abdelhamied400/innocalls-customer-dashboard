"use client";

import {
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
import { useState } from "react";
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
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { columns } from "./columns";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import billingService from "@/services/billing.service";
import { FilterAltOutlined, Search } from "@mui/icons-material";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Toggle } from "@/components/ui/toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FilterDialog from "@/components/FilterDialog";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTranslations } from "next-intl";

type RatesFilters = {
  search: string;
  serviceId?: string;
};

const BillingTable = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filters, setFilters] = useState<RatesFilters>({
    search: "",
    serviceId: "1",
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const t = useTranslations("billing.rates");
  const tCommon = useTranslations("common");

  const {
    data: rates = {
      data: [],
      current_page: 1,
      from: 1,
      last_page: 1,
      page: 1,
      per_page: 10,
      to: 1,
      total: 0,
    },
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "rates",
      pagination.pageIndex,
      pagination.pageSize,
      filters.search,
    ],
    queryFn: async () =>
      await billingService.getRatesList(
        pagination.pageIndex + 1,
        pagination.pageSize,
        {
          filter: filters.search,
          serviceId: filters.serviceId,
        }
      ),
  });

  const table = useReactTable({
    data: rates.data,
    columns: columns(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    pageCount: rates.last_page,
    manualPagination: true,
    manualFiltering: true,
    state: {
      sorting,
      pagination,
    },
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const search = event.target.value;
    setFilters((prev) => ({
      ...prev,
      search,
    }));
  };

  return (
    <div className="h-full flex flex-col border rounded-xl">
      <Collapsible>
        <div className="users-table-head flex items-center justify-between p-4">
          <h2>{t("title")}</h2>
          <div className="actions flex items-center gap-2">
            <Field preIcon={<Search />}>
              <Input
                variant="field"
                placeholder={tCommon("search.placeholder")}
                value={filters.search}
                onChange={handleSearchChange}
                type="search"
              />
            </Field>

            <CollapsibleTrigger asChild>
              <Toggle pressed={true} className="rounded-full">
                <FilterAltOutlined />
              </Toggle>
            </CollapsibleTrigger>
          </div>
        </div>
        <CollapsibleContent className="border-t p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="filter" size="filter">
                {t("filters.service.label")}
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <FilterDialog
                title={t("filters.service.placeholder")}
                onReset={() => {
                  setFilters((prev) => ({ ...prev, serviceId: "1" }));
                  setTimeout(() => {
                    refetch();
                  }, 0);
                }}
                onApply={() => {
                  refetch();
                }}
              >
                <RadioGroup
                  defaultValue=""
                  onValueChange={(value) => {
                    setFilters((prev) => ({ ...prev, serviceId: value }));
                  }}
                  value={filters.serviceId || "1"}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="calls" />
                    <Label htmlFor="calls">{t("services.calls")}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id="sms" />
                    <Label htmlFor="sms">{t("services.sms")}</Label>
                  </div>
                </RadioGroup>
              </FilterDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </CollapsibleContent>
      </Collapsible>

      <div className="flex-1 overflow-auto">
        <Table className="min-h-full w-full">
          <TableHeader className="bg-gray-100 sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
            {isLoading && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {tCommon("states.loading")}
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              (table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
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
                    {tCommon("search.noResults")}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      {!isLoading && table.getRowModel().rows?.length > 0 && (
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

                {Array.from({ length: rates.last_page }, (_, i) => i + 1).map(
                  (page, idx) => (
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
            <label className="text-sm">
              {tCommon("pagination.rowsPerPage")}:
            </label>
            <Select
              onValueChange={(pageSize) =>
                table.setPageSize(parseInt(pageSize, 10))
              }
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
              {rates.from}-{rates.to}
              {rates.total ? ` ${tCommon("pagination.of")} ${rates.total}` : ""}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingTable;
