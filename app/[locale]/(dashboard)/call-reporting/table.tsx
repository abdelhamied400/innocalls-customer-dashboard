"use client";

import callReportingService from "@/services/call-reporting.service";
import { CallReportingFilters, Option } from "@/types/api/call-reporting";
import { useQuery } from "@tanstack/react-query";
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
import { useEffect, useState } from "react";
import { columns } from "./columns";
import Field from "@/components/ui/field";
import { FilterAltOutlined, Search } from "@mui/icons-material";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import MultiSelect from "@/components/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import DatePicker from "@/components/ui/date-picker";
import { format } from "date-fns";
import { useFilters } from "@/hooks/use-filters";
import useVocabStore from "@/store/vocab.slice";
import { isValidDateRange } from "@/lib/date";
import { useToast } from "@/hooks/use-toast";
import { isAxiosError } from "axios";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { FilterBar } from "@/components/FilterBar";
import { FilterBox } from "@/components/FilterBox";

type CallReportingTableProps = {
  initialPagination?: {
    pageIndex: number;
    pageSize: number;
  };
  initialFilters?: CallReportingFilters;
  initialSorting?: SortingState;
};

// 30 days ago
const defaultFromDate = new Date();
defaultFromDate.setDate(defaultFromDate.getDate() - 30);
// today
const defaultToDate = new Date();

const defaultFilters: CallReportingFilters = {
  fromDate: defaultFromDate,
  toDate: defaultToDate,
  sourceExtensions: [],
  destinationExtensions: [],
  tags: [],
  callStatuses: "",
  search: "",
};

const CallReportingTable = ({
  initialFilters = {},
  initialSorting = [],
  initialPagination = {
    pageIndex: 0,
    pageSize: 10,
  },
}: CallReportingTableProps) => {
  const router = useRouter();
  const { updateFilters } = useFilters();
  const { toast } = useToast();
  const { extensions, tags } = useVocabStore();
  const { data: session, status } = useSession();

  const [isExporting, setIsExporting] = useState(false);

  const extensionsOptions = extensions.map((ext) => ({
    label: `${ext.name} (${ext.ext})`,
    value: ext.ext,
  }));

  const [filters, setFilters] = useState<CallReportingFilters>({
    ...defaultFilters,
    ...initialFilters,
  });

  const [pagesCount, setPagesCount] = useState<number>(
    initialPagination.pageIndex
  );
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: initialPagination?.pageIndex || 0,
    pageSize: initialPagination?.pageSize || 10,
  });

  // Initialize the query to fetch call reporting data
  const {
    data: callReporting,
    isFetching,
    isPlaceholderData,
    refetch,
    isError,
    error,
  } = useQuery({
    queryKey: ["call-reporting", pagination.pageIndex, pagination.pageSize],
    queryFn: async () =>
      await callReportingService.getCallReporting(
        pagination.pageIndex + 1,
        pagination.pageSize,
        filters
      ),
    placeholderData: {
      data: [],
      current_page: 0,
      from: 0,
      last_page: 0,
      page: 0,
      per_page: 0,
      to: 0,
      total: 0,
    },
    retry: 0,
  });

  const table = useReactTable({
    data: callReporting?.data || [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    state: {
      pagination,
    },
  });

  // Update the pages count when callReporting data changes
  useEffect(() => {
    if (!isPlaceholderData && callReporting?.last_page) {
      setPagesCount(callReporting.last_page);
    }
  }, [isPlaceholderData, callReporting]);

  // pagination calculations
  const { pageIndex, pageSize } = table.getState().pagination;
  const totalItems = table.getFilteredRowModel().rows.length;
  const startRowIndex = pageIndex * pageSize + 1;
  const endRowIndex = Math.min((pageIndex + 1) * pageSize, totalItems);
  const pages = Array.from({ length: pagesCount }, (_, i) => i + 1);

  //? on any change in pagination, sorting, or filters, update the URL
  useEffect(() => {
    updateFilters({
      page: (pageIndex + 1).toString(),
      pageSize: pageSize.toString(),
      ...filters,
      fromDate: filters.fromDate
        ? format(filters.fromDate, "yyyy-MM-dd")
        : undefined,
      toDate: filters.toDate ? format(filters.toDate, "yyyy-MM-dd") : undefined,
      sourceExtensions: Array.isArray(filters.sourceExtensions)
        ? filters.sourceExtensions.map((ext) => ext.value).join(",")
        : typeof filters.sourceExtensions === "string"
        ? filters.sourceExtensions
        : undefined,
      destinationExtensions: Array.isArray(filters.destinationExtensions)
        ? filters.destinationExtensions.map((ext) => ext.value).join(",")
        : typeof filters.destinationExtensions === "string"
        ? filters.destinationExtensions
        : undefined,
      tags: Array.isArray(filters.tags)
        ? filters.tags.map((tag) => tag.value).join(",")
        : typeof filters.tags === "string"
        ? filters.tags
        : undefined,
    });
  }, [pageIndex, pageSize, filters, updateFilters]);

  const applyFilters = () => {
    let isValid = true;
    isValid = isValidDateRange(filters.fromDate, filters.toDate, (message) => {
      toast({
        title: "Invalid date range",
        description: message,
        variant: "destructive",
      });
    });

    if (!isValid) return;

    setTimeout(() => {
      refetch();
    }, 0);
  };

  useEffect(() => {
    if (isError) {
      let message = "An unexpected error occurred";
      if (isAxiosError(error)) {
        message = error?.response?.data.message;
      } else {
        message = error?.message;
      }
      toast({
        title: "Error fetching data",
        description: message,
        variant: "destructive",
      });
      setFilters(defaultFilters);
      setTimeout(() => {
        refetch();
      }, 0);
    }
  }, [isError, error, toast]);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const res = await callReportingService.exportCallReporting({
        ...filters,
        userEmail: session?.user?.email || "",
      });

      toast({
        title: "Export started",
        description:
          "Your export is being processed. You will be notified by email when it's ready.",
      });
    } catch (error) {
      let message = "An unexpected error occurred";
      if (isAxiosError(error)) {
        message = error?.response?.data.message;
      }
      toast({
        title: "Error exporting data",
        description: message,
        variant: "destructive",
      });
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* header and filters */}
      <Collapsible>
        <div className="call-reporting-table-head flex items-center justify-between p-4">
          <h2>Call Reporting</h2>
          <div className="flex items-center gap-2">
            <div className="searchbar">
              <Field preIcon={<Search />}>
                <Input variant="field" placeholder="Search..." type="search" />
              </Field>
            </div>
            <div className="actions flex items-center gap-2">
              <CollapsibleTrigger asChild>
                <Toggle pressed={true} className="rounded-full">
                  <FilterAltOutlined />
                </Toggle>
              </CollapsibleTrigger>
              <Button
                variant="default"
                onClick={handleExport}
                loading={isExporting}
              >
                Export
              </Button>
            </div>
          </div>
        </div>
        <CollapsibleContent className="">
          <FilterBar
            onClear={() => {
              setFilters(defaultFilters);
              setTimeout(() => {
                refetch();
              }, 0);
            }}
          >
            <FilterBox
              triggerLabel="Call Date"
              label="Select a date range"
              onReset={() => {
                setFilters({
                  ...filters,
                  fromDate: defaultFromDate,
                  toDate: defaultToDate,
                });
                updateFilters({
                  fromDate: format(defaultFromDate, "yyyy-MM-dd"),
                  toDate: format(defaultToDate, "yyyy-MM-dd"),
                });
                setTimeout(() => {
                  refetch();
                }, 0);
              }}
              onApply={applyFilters}
              numberOfFilters={
                (filters.fromDate ? 1 : 0) + (filters.toDate ? 1 : 0)
              }
            >
              <Field
                label="From"
                hint="DD/MM/YYYY"
                postIcon={<Calendar className="text-gray-400" />}
              >
                <DatePicker
                  className="flex-1"
                  placeholder="Enter from date"
                  value={filters.fromDate}
                  onChange={(date) => {
                    setFilters((prev) => ({
                      ...prev,
                      fromDate: date || undefined,
                    }));
                  }}
                />
              </Field>
              <Field
                label="To"
                hint="DD/MM/YYYY"
                postIcon={<Calendar className="text-gray-400" />}
              >
                <DatePicker
                  className="flex-1"
                  placeholder="Enter to date"
                  value={filters.toDate}
                  onChange={(date) =>
                    setFilters((prev) => ({
                      ...prev,
                      toDate: date || undefined,
                    }))
                  }
                />
              </Field>
            </FilterBox>
            <FilterBox
              className="max-w-sm"
              triggerLabel="Source"
              label="Filter by Source Extensions"
              onReset={() => {
                setFilters((prev) => ({
                  ...prev,
                  sourceExtensions: undefined,
                }));
                updateFilters({ sourceExtensions: undefined });
                setTimeout(() => {
                  refetch();
                }, 0);
              }}
              onApply={() => {
                updateFilters({
                  sourceExtensions: Array.isArray(filters.sourceExtensions)
                    ? filters.sourceExtensions.map((ext) => ext.value).join(",")
                    : typeof filters.sourceExtensions === "string"
                    ? filters.sourceExtensions
                    : undefined,
                });
                refetch();
              }}
              numberOfFilters={
                Array.isArray(filters.sourceExtensions)
                  ? filters.sourceExtensions.length
                  : filters.sourceExtensions
                  ? filters.sourceExtensions.split(",").filter(Boolean).length
                  : 0
              }
            >
              <MultiSelect
                isCreatable
                options={extensionsOptions}
                onChange={(extensions) => {
                  setFilters((prev) => ({
                    ...prev,
                    sourceExtensions: extensions,
                  }));
                }}
                value={
                  Array.isArray(filters.sourceExtensions)
                    ? filters.sourceExtensions
                    : typeof filters.sourceExtensions === "string"
                    ? filters.sourceExtensions
                        .split(",")
                        .map(
                          (ext) =>
                            extensionsOptions.find(
                              (option) => option.value === ext
                            ) || { label: ext, value: ext }
                        )
                    : undefined
                }
                isMulti
                badgeClassName="text-xs"
                getLabel={(option) => option?.label || ""}
                getValue={(option) => option?.value || ""}
                onCreateOption={(newOption) => {
                  // accept only numbers
                  if (/^\d+$/.test(newOption)) {
                    const newExt = { label: newOption, value: newOption };
                    setFilters((prev) => ({
                      ...prev,
                      sourceExtensions: [
                        ...(Array.isArray(prev.sourceExtensions)
                          ? prev.sourceExtensions
                          : []),
                        newExt,
                      ],
                    }));
                    return newExt;
                  }
                  toast({
                    title: "Invalid extension",
                    description: "Please enter a valid number.",
                    variant: "destructive",
                  });
                  return false;
                }}
              />
            </FilterBox>
            <FilterBox
              className="max-w-sm"
              triggerLabel="Destination"
              label="Filter by Destination Extensions"
              onReset={() => {
                setFilters((prev) => ({
                  ...prev,
                  destinationExtensions: undefined,
                }));
                updateFilters({ destinationExtensions: undefined });
                setTimeout(() => {
                  refetch();
                }, 0);
              }}
              onApply={() => {
                updateFilters({
                  destinationExtensions: Array.isArray(
                    filters.destinationExtensions
                  )
                    ? filters.destinationExtensions
                        .map((ext) => ext.value)
                        .join(",")
                    : typeof filters.destinationExtensions === "string"
                    ? filters.destinationExtensions
                    : undefined,
                });
                refetch();
              }}
              numberOfFilters={
                Array.isArray(filters.destinationExtensions)
                  ? filters.destinationExtensions.length
                  : filters.destinationExtensions
                  ? filters.destinationExtensions.split(",").filter(Boolean)
                      .length
                  : 0
              }
            >
              <MultiSelect
                isCreatable
                options={extensionsOptions}
                onChange={(extensions) => {
                  setFilters((prev) => ({
                    ...prev,
                    destinationExtensions: extensions,
                  }));
                }}
                value={
                  Array.isArray(filters.destinationExtensions)
                    ? filters.destinationExtensions
                    : typeof filters.destinationExtensions === "string"
                    ? filters.destinationExtensions
                        .split(",")
                        .map(
                          (ext) =>
                            extensionsOptions.find(
                              (option) => option.value === ext
                            ) || { label: ext, value: ext }
                        )
                    : undefined
                }
                isMulti
                badgeClassName="text-xs"
                getLabel={(option) => option?.label || ""}
                getValue={(option) => option?.value || ""}
              />
            </FilterBox>
            <FilterBox
              triggerLabel="Tags"
              label="Filter by Tags"
              onReset={() => {
                setFilters((prev) => ({
                  ...prev,
                  tags: undefined,
                }));
                updateFilters({ tags: undefined });
                setTimeout(() => {
                  refetch();
                }, 0);
              }}
              onApply={() => {
                updateFilters({
                  tags: Array.isArray(filters.tags)
                    ? filters.tags.map((tag) => tag.value).join(",")
                    : typeof filters.tags === "string"
                    ? filters.tags
                    : undefined,
                });
                refetch();
              }}
              numberOfFilters={
                filters.tags
                  ? Array.isArray(filters.tags)
                    ? filters.tags.length
                    : filters.tags.split(",").filter(Boolean).length
                  : 0
              }
            >
              <MultiSelect
                options={tags.map((tag) => ({
                  label: tag.nameEN,
                  value: tag.nameEN,
                }))}
                onChange={(selectedTags) => {
                  setFilters((prev) => ({
                    ...prev,
                    tags:
                      selectedTags && selectedTags.length
                        ? selectedTags.map((tag: Option) => tag.value).join(",")
                        : undefined,
                  }));
                }}
                value={
                  Array.isArray(filters.tags)
                    ? filters.tags
                    : typeof filters.tags === "string"
                    ? filters.tags.split(",").map((tagValue) => ({
                        label:
                          tags.find((tag) => tag.nameEN === tagValue)?.nameEN ||
                          tagValue,
                        value: tagValue,
                      }))
                    : []
                }
                isMulti
                badgeClassName="text-xs"
                getLabel={(option) => option?.label || ""}
                getValue={(option) => option?.value || ""}
              />
            </FilterBox>
            <FilterBox
              triggerLabel="Call Status"
              label="Filter by Call Statuses"
              onReset={() => {
                setFilters((prev) => ({
                  ...prev,
                  callStatuses: undefined,
                }));
                updateFilters({ callStatuses: undefined });
                setTimeout(() => {
                  refetch();
                }, 0);
              }}
              onApply={() => {
                updateFilters({
                  callStatuses: filters.callStatuses,
                });
                refetch();
              }}
              numberOfFilters={
                filters.callStatuses
                  ? Array.isArray(filters.callStatuses)
                    ? filters.callStatuses.length
                    : filters.callStatuses.split(",").filter(Boolean).length
                  : 0
              }
            >
              <div className="flex flex-col gap-2">
                {[
                  { value: "ANSWERED", label: "Answered" },
                  { value: "FAILED", label: "Failed" },
                  { value: "NO ANSWER", label: "No Answer" },
                  { value: "BUSY", label: "Busy" },
                ].map((status) => (
                  <div key={status.value} className="flex items-center gap-2">
                    <Checkbox
                      id={`call-status-${status.value}`}
                      checked={
                        Array.isArray(filters.callStatuses)
                          ? filters.callStatuses.includes(status.value)
                          : typeof filters.callStatuses === "string"
                          ? filters.callStatuses
                              .split(",")
                              .includes(status.value)
                          : false
                      }
                      onCheckedChange={(checked) => {
                        let current: string[] = [];
                        if (Array.isArray(filters.callStatuses)) {
                          current = filters.callStatuses;
                        } else if (
                          typeof filters.callStatuses === "string" &&
                          filters.callStatuses
                        ) {
                          current = filters.callStatuses.split(",");
                        }
                        let updated: string[];
                        if (checked) {
                          updated = Array.from(
                            new Set([...current, status.value])
                          );
                        } else {
                          updated = current.filter((v) => v !== status.value);
                        }
                        setFilters((prev) => ({
                          ...prev,
                          callStatuses:
                            updated.length > 0 ? updated.join(",") : undefined,
                        }));
                      }}
                    />
                    <Label htmlFor={`call-status-${status.value}`}>
                      {status.label}
                    </Label>
                  </div>
                ))}
              </div>
            </FilterBox>
          </FilterBar>
        </CollapsibleContent>
      </Collapsible>

      {/* table body */}
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

          {isFetching && (
            <TableBody>
              {Array.from({ length: 10 }, (_, index) => (
                <TableRow key={index}>
                  {Array.from({ length: columns.length }, (_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          )}

          {!isFetching && (
            <TableBody>
              {table.getRowModel().rows?.length ? (
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
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </div>

      {/* pagination */}
      <div className="flex justify-between items-center gap-2 p-4">
        <div className="pagination">
          <Pagination className="justify-normal">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => {
                    table.previousPage();
                  }}
                  disabled={!table.getCanPreviousPage()}
                />
              </PaginationItem>

              {pages.map((page, idx) => (
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
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => {
                    table.nextPage();
                  }}
                  disabled={!table.getCanNextPage()}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        <div className="flex items-center gap-2 per-page">
          <label className="text-sm">Rows per page:</label>
          <Select
            onValueChange={(value) => table.setPageSize(Number(value))}
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
            {startRowIndex}-{endRowIndex}
            {totalItems ? ` of ${totalItems}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CallReportingTable;
