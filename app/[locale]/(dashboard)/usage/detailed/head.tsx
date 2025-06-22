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
import usageService, { UsageDetailedFilters } from "@/services/usage.service";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Toggle } from "@/components/ui/toggle";
import { Download, FilterAltOutlined } from "@mui/icons-material";
import DatePicker from "@/components/ui/date-picker";
import TableSkeleton from "@/components/ui/table-skeleton";
import { FilterBar } from "@/components/FilterBar";
import { FilterBox } from "@/components/FilterBox";
import { isValidDateRange } from "@/lib/date";
import { useToast } from "@/hooks/use-toast";
import useVocabStore from "@/store/vocab.slice";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useFilters } from "@/hooks/use-filters";
import { format } from "date-fns";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { usePaginatedTable } from "@/components/Table/PaginatedTable";

// 30 days ago
const defaultFromDate = new Date();
defaultFromDate.setDate(defaultFromDate.getDate() - 30);
// today
const defaultToDate = new Date();

type DetailedUsageHeadProps = {
  filters: UsageDetailedFilters;
  setFilters: React.Dispatch<React.SetStateAction<UsageDetailedFilters>>;
};
const DetailedUsageHead = ({ filters, setFilters }: DetailedUsageHeadProps) => {
  const { toast } = useToast();
  const { packages, accounts } = useVocabStore();
  const { table } = usePaginatedTable();

  const [accountId, setAccountId] = useState<string>("");
  const [origin, setOrigin] = useState<string>("");
  const [packageId, setPackageId] = useState<string>("");
  const [fromDate, setFromDate] = useState<Date>(
    filters.fromDate || defaultFromDate
  );
  const [toDate, setToDate] = useState<Date>(filters.toDate || defaultToDate);

  const [isExporting, setIsExporting] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      codeName: e.target.value,
    }));
  };

  const applyFilters = () => {
    const isValid = isValidDateRange(
      fromDate,
      toDate,
      (message) => {
        toast({
          title: "Invalid date range",
          description: message,
          variant: "destructive",
        });
      },
      30 // max 30 days range
    );

    if (!isValid) return;

    table.setPageIndex(0);

    setFilters((prev) => ({
      ...prev,
      accountId: accountId || "",
      origin: origin || "",
      packageId: packageId || "",
      fromDate: fromDate,
      toDate: toDate,
    }));
  };

  const exportUsage = async () => {
    try {
      setIsExporting(true);
      await usageService.exportUsageDetailed(filters);
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
    <Collapsible>
      <div className="usage-detailed-table-head flex items-center justify-between p-4">
        <h2>Usage Detailed</h2>
        <div className="actions flex items-center gap-2">
          <Field preIcon={<SearchIcon />}>
            <Input
              variant="field"
              placeholder="Search..."
              value={filters.codeName}
              onChange={handleSearchChange}
              type="search"
            />
          </Field>
          <CollapsibleTrigger asChild>
            <Toggle pressed={true} className="rounded-full">
              <FilterAltOutlined />
            </Toggle>
          </CollapsibleTrigger>
          <Button
            size="icon"
            variant="ghost"
            onClick={exportUsage}
            loading={isExporting}
          >
            <Download />
          </Button>
        </div>
      </div>
      <CollapsibleContent>
        <FilterBar
          onClear={() => {
            setFilters({
              fromDate: defaultFromDate,
              toDate: defaultToDate,
            });
          }}
        >
          <FilterBox
            triggerLabel="Account"
            label="Select an account"
            onReset={() => {
              setFilters((prev) => ({ ...prev, accountId: "" }));
              setAccountId("");
            }}
            onApply={applyFilters}
            numberOfFilters={accountId ? 1 : 0}
          >
            <Select onValueChange={setAccountId} value={accountId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an account" />
              </SelectTrigger>
              <SelectContent>
                {accounts?.map((account) => (
                  <SelectItem key={account.id} value={account.id.toString()}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterBox>
          <FilterBox
            triggerLabel="Origin"
            label="Select an origin"
            onReset={() => {
              setFilters((prev) => ({ ...prev, origin: "" }));
              setOrigin("");
            }}
            onApply={applyFilters}
            numberOfFilters={origin ? 1 : 0}
          >
            <RadioGroup
              defaultValue=""
              onValueChange={setOrigin}
              value={origin}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="orig" id="orig" />
                <Label htmlFor="orig">Outgoing</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="term" id="term" />
                <Label htmlFor="term">Incoming</Label>
              </div>
            </RadioGroup>
          </FilterBox>
          <FilterBox
            triggerLabel="Package"
            label="Select a package"
            onReset={() => {
              setFilters((prev) => ({ ...prev, packageId: "" }));
              setPackageId("");
            }}
            onApply={applyFilters}
            numberOfFilters={packageId ? 1 : 0}
          >
            <Select onValueChange={setPackageId} value={packageId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an account" />
              </SelectTrigger>
              <SelectContent>
                {packages?.map((pkg) => (
                  <SelectItem key={pkg.id} value={pkg.id.toString()}>
                    {pkg.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterBox>
          <FilterBox
            triggerLabel="Date Range"
            label="Select a date range"
            onReset={() => {
              setFilters((prev) => ({
                ...prev,
                fromDate: defaultToDate,
                toDate: defaultToDate,
              }));
              setFromDate(defaultFromDate);
              setToDate(defaultToDate);
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
                onChange={(date) => setFromDate(date || defaultFromDate)}
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
                onChange={(date) => setToDate(date || defaultToDate)}
              />
            </Field>
          </FilterBox>
        </FilterBar>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default DetailedUsageHead;
