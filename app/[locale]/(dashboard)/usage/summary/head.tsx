"use client";

import {
  ColumnFiltersState,
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
import { useEffect, useState } from "react";
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
import { CalendarIcon, SearchIcon } from "lucide-react";
import { createColumns } from "./columns";
import { useQuery } from "@tanstack/react-query";
import usageService, { UsageSummaryFilters } from "@/services/usage.service";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Toggle } from "@/components/ui/toggle";
import { FilterAltOutlined } from "@mui/icons-material";
import DatePicker from "@/components/ui/date-picker";
import TableSkeleton from "@/components/ui/table-skeleton";
import { FilterBar } from "@/components/FilterBar";
import { FilterBox } from "@/components/FilterBox";
import { isValidDateRange } from "@/lib/date";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useFilters } from "@/hooks/use-filters";
import { format } from "date-fns";
import { isAxiosError } from "axios";
import PaginatedTable, {
  usePaginatedTable,
} from "@/components/Table/PaginatedTable";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// 30 days ago
const defaultFromDate = new Date();
defaultFromDate.setDate(defaultFromDate.getDate() - 30);
// today
const defaultToDate = new Date();

const defaultFilters = {
  search: "",
  fromDate: defaultFromDate,
  toDate: defaultToDate,
  groupBy: [],
};

type UsageSummaryHeadProps = {
  filters: UsageSummaryFilters;
  setFilters: React.Dispatch<React.SetStateAction<UsageSummaryFilters>>;
};
const UsageSummaryHead = ({ filters, setFilters }: UsageSummaryHeadProps) => {
  const [fromDate, setFromDate] = useState<Date>(defaultFromDate);
  const [toDate, setToDate] = useState<Date>(defaultToDate);
  const [groupBy, setGroupBy] = useState<string[]>([]);
  const [summaryBy, setSummaryBy] = useState<string>("");

  const { toast } = useToast();
  const { table } = usePaginatedTable();

  const applyFilters = () => {
    const isValidRange = isValidDateRange(
      fromDate,
      toDate,
      (message) => {
        toast({
          title: "Invalid date range",
          description: message,
          variant: "destructive",
        });
      },
      30
    );

    if (!isValidRange) return;

    setFilters((prev) => ({
      ...prev,
      fromDate,
      toDate,
      groupBy: [
        ...groupBy,
        // Ensure we only add unique groupings for summary by filter
        ...(summaryBy ? [summaryBy] : []),
      ],
    }));

    table.setPageIndex(0); // Reset to first page on filter change
  };

  return (
    <Collapsible>
      <div className="usage-summary-table-head flex items-center justify-between p-4">
        <h2>Usage Summary</h2>
        <div className="actions flex items-center gap-2">
          <CollapsibleTrigger asChild>
            <Toggle pressed={true} className="rounded-full">
              <FilterAltOutlined />
            </Toggle>
          </CollapsibleTrigger>
        </div>
      </div>
      <CollapsibleContent>
        <FilterBar
          onClear={() => {
            setFilters(defaultFilters);
            setFromDate(defaultFromDate);
            setToDate(defaultToDate);
            setGroupBy([]);
            table.setPageIndex(0); // Reset to first page on filter change
          }}
        >
          <FilterBox
            triggerLabel="Creation Date"
            label="Select a date range"
            onReset={() => {
              setFilters((prev) => ({
                ...prev,
                fromDate: defaultFromDate,
                toDate: defaultToDate,
              }));
              setFromDate(defaultFromDate);
              setToDate(defaultToDate);
              table.setPageIndex(0); // Reset to first page on filter change
            }}
            onApply={applyFilters}
            numberOfFilters={(fromDate ? 1 : 0) + (toDate ? 1 : 0)}
          >
            <Field
              label="From"
              hint="DD/MM/YYYY"
              postIcon={<CalendarIcon className="text-gray-400" />}
            >
              <DatePicker
                className="flex-1"
                placeholder="Enter from date"
                value={fromDate}
                onChange={(date) => {
                  if (date) setFromDate(date);
                }}
              />
            </Field>
            <Field
              label="To"
              hint="DD/MM/YYYY"
              postIcon={<CalendarIcon className="text-gray-400" />}
            >
              <DatePicker
                className="flex-1"
                placeholder="Enter to date"
                value={toDate}
                onChange={(date) => {
                  if (date) setToDate(date);
                }}
              />
            </Field>
          </FilterBox>
          <FilterBox
            triggerLabel="Show By"
            label="Show by"
            onReset={() => {
              setFilters((prev) => ({
                ...prev,
                groupBy: [],
              }));
              setGroupBy([]);
              table.setPageIndex(0); // Reset to first page on filter change
            }}
            onApply={applyFilters}
            numberOfFilters={groupBy.length}
          >
            <div className="code-name flex items-center gap-2">
              <Checkbox
                id="codeName"
                checked={groupBy.includes("codeName")}
                onCheckedChange={(checked) => {
                  setGroupBy((prev) =>
                    checked
                      ? [...prev, "codeName"]
                      : prev.filter((item) => item !== "codeName")
                  );
                }}
              />
              <Label>Service name</Label>
            </div>
            {/* accountsName,packagesName */}
            <div className="accounts-name flex items-center gap-2">
              <Checkbox
                id="accountsName"
                checked={groupBy.includes("accountsName")}
                onCheckedChange={(checked) => {
                  setGroupBy((prev) =>
                    checked
                      ? [...prev, "accountsName"]
                      : prev.filter((item) => item !== "accountsName")
                  );
                }}
              />
              <Label>Accounts name</Label>
            </div>
            <div className="packages-name flex items-center gap-2">
              <Checkbox
                id="packagesName"
                checked={groupBy.includes("packagesName")}
                onCheckedChange={(checked) => {
                  setGroupBy((prev) =>
                    checked
                      ? [...prev, "packagesName"]
                      : prev.filter((item) => item !== "packagesName")
                  );
                }}
              />
              <Label>Packages name</Label>
            </div>
          </FilterBox>
          <FilterBox
            triggerLabel="Summary By"
            label="Summary By"
            onReset={() => {
              setFilters((prev) => ({
                ...prev,
                summaryBy: undefined,
              }));
              setSummaryBy("");
              table.setPageIndex(0); // Reset to first page on filter change
            }}
            onApply={applyFilters}
            numberOfFilters={summaryBy ? 1 : 0}
          >
            <RadioGroup
              defaultValue=""
              onValueChange={setSummaryBy}
              value={summaryBy}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="" id="general" />
                <Label htmlFor="general">General</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dateDay" id="dateDay" />
                <Label htmlFor="dateDay">by day</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dateMonth" id="dateMonth" />
                <Label htmlFor="dateMonth">by month</Label>
              </div>
            </RadioGroup>
          </FilterBox>
        </FilterBar>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default UsageSummaryHead;
