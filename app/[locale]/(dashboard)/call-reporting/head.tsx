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
import { format, set } from "date-fns";
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

type CallReportingHeadProps = {
  filters: CallReportingFilters;
  setFilters: React.Dispatch<React.SetStateAction<CallReportingFilters>>;
};
const CallReportingHead = ({ filters, setFilters }: CallReportingHeadProps) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const { data: session } = useSession();
  const { extensions, tags } = useVocabStore();
  const extensionsOptions = extensions.map((ext) => ({
    label: `${ext.name} (${ext.ext})`,
    value: ext.ext,
  }));
  const tagsOptions = tags.map((tag) => ({
    label: tag.nameEN,
    value: tag.id,
  }));
  const statusesOptions = [
    { value: "ANSWERED", label: "Answered" },
    { value: "FAILED", label: "Failed" },
    { value: "NO ANSWER", label: "No Answer" },
    { value: "BUSY", label: "Busy" },
  ];

  const [fromDate, setFromDate] = useState<Date | undefined>(
    filters.fromDate ? new Date(filters.fromDate) : undefined
  );
  const [toDate, setToDate] = useState<Date | undefined>(
    filters.toDate ? new Date(filters.toDate) : undefined
  );
  const [sourceExtensions, setSourceExtensions] = useState<Option[]>([]);
  const [destinationExtensions, setDestinationExtensions] = useState<Option[]>(
    []
  );
  const [selectedTags, setSelectedTags] = useState<Option[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await callReportingService.exportCallReporting({
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

  const applyFilters = () => {
    const isValid = isValidDateRange(fromDate, toDate, (message) => {
      toast({
        title: "Invalid date range",
        description: message,
        variant: "destructive",
      });
    });

    if (!isValid) return;

    setFilters((prev) => ({
      ...prev,
      fromDate: fromDate,
      toDate: toDate,
      sourceExtensions:
        sourceExtensions.length > 0
          ? sourceExtensions.map((ext) => ext.value).join(",")
          : undefined,
      destinationExtensions:
        destinationExtensions.length > 0
          ? destinationExtensions.map((ext) => ext.value).join(",")
          : undefined,
      tags:
        selectedTags.length > 0
          ? selectedTags.map((tag) => tag.value).join(",")
          : undefined,
      callStatuses:
        selectedStatuses.length > 0 ? selectedStatuses.join(",") : undefined,
    }));
  };

  return (
    <Collapsible>
      <div className="call-reporting-table-head flex items-center justify-between p-4">
        <h2>Call Reporting</h2>
        <div className="flex items-center gap-2">
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
            setFilters({});
            setFromDate(undefined);
            setToDate(undefined);
            setSourceExtensions([]);
            setDestinationExtensions([]);
            setSelectedTags([]);
            setSelectedStatuses([]);
          }}
        >
          <FilterBox
            triggerLabel="Call Date"
            label="Select a date range"
            onReset={() => {
              setFilters({
                ...filters,
                fromDate: undefined,
                toDate: undefined,
              });
              setFromDate(undefined);
              setToDate(undefined);
            }}
            onApply={applyFilters}
            numberOfFilters={(fromDate ? 1 : 0) + (toDate ? 1 : 0)}
          >
            <Field
              label="From"
              hint="DD/MM/YYYY"
              postIcon={<Calendar className="text-gray-400" />}
            >
              <DatePicker
                className="flex-1"
                placeholder="Enter from date"
                value={fromDate}
                onChange={setFromDate}
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
                value={toDate}
                onChange={setToDate}
              />
            </Field>
          </FilterBox>
          <FilterBox
            triggerLabel="Source"
            label="Filter by Source Extensions"
            onReset={() => {
              setFilters((prev) => ({
                ...prev,
                sourceExtensions: [],
              }));
              setSourceExtensions([]);
            }}
            onApply={applyFilters}
            numberOfFilters={sourceExtensions.length}
          >
            <MultiSelect
              isCreatable
              options={extensionsOptions}
              onChange={(exs) => setSourceExtensions(exs || [])}
              value={sourceExtensions}
              isMulti
              badgeClassName="text-xs"
              getLabel={(option) => option?.label || ""}
              getValue={(option) => option?.value || ""}
              onCreateOption={(newOption) => {
                // accept only numbers
                if (/^\d+$/.test(newOption)) {
                  const newExt = { label: newOption, value: newOption };
                  setSourceExtensions((prev) => [...prev, newExt]);
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
            triggerLabel="Destination"
            label="Filter by Destination Extensions"
            onReset={() => {
              setFilters((prev) => ({
                ...prev,
                destinationExtensions: [],
              }));
              setDestinationExtensions([]);
            }}
            onApply={applyFilters}
            numberOfFilters={destinationExtensions.length}
          >
            <MultiSelect
              isCreatable
              options={extensionsOptions}
              onChange={(exs) => setDestinationExtensions(exs || [])}
              value={destinationExtensions}
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
                tags: [],
              }));
              setSelectedTags([]);
            }}
            onApply={applyFilters}
            numberOfFilters={selectedTags.length}
          >
            <MultiSelect
              options={tagsOptions}
              onChange={(tags) => setSelectedTags(tags || [])}
              value={selectedTags}
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
              setSelectedStatuses([]);
            }}
            onApply={applyFilters}
            numberOfFilters={selectedStatuses.length}
          >
            <div className="flex flex-col gap-2">
              {statusesOptions.map((status) => (
                <div key={status.value} className="flex items-center gap-2">
                  <Checkbox
                    id={`call-status-${status.value}`}
                    checked={selectedStatuses.includes(status.value)}
                    onCheckedChange={(checked) => {
                      setSelectedStatuses((prev) =>
                        checked
                          ? [...prev, status.value]
                          : prev.filter((s) => s !== status.value)
                      );
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
  );
};

export default CallReportingHead;
