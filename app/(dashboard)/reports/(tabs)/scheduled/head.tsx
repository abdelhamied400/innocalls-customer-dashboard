"use client";

import { ScheduledReportFilters } from "@/types/api/report";
import { useState } from "react";
import Field from "@/components/ui/field";
import { FilterAltOutlined, Search } from "@mui/icons-material";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";
import Link from "next/link";
import DatePicker from "@/components/ui/date-picker";
import { isValidDateRange } from "@/lib/date";
import { toast } from "sonner";
import { FilterBar } from "@/components/FilterBar";
import { FilterBox } from "@/components/FilterBox";
import { usePaginatedTable } from "@/components/Table/PaginatedTable";
import { useTranslations } from "@/providers/TranslationProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type ScheduledReportHeadProps = {
  filters: ScheduledReportFilters;
  setFilters: React.Dispatch<React.SetStateAction<ScheduledReportFilters>>;
};

const ScheduledReportHead = ({ filters, setFilters }: ScheduledReportHeadProps) => {
  const t = useTranslations("reports.scheduled");
  const tCommon = useTranslations("common");

  const { table } = usePaginatedTable();

  const [fromDate, setFromDate] = useState<Date | undefined>(filters.fromDate);
  const [toDate, setToDate] = useState<Date | undefined>(filters.toDate);
  const [search, setSearch] = useState<string>(filters.search || "");
  const [frequency, setFrequency] = useState<string>(filters.frequency || "");
  const [status, setStatus] = useState<string>(filters.status || "");

  const applyDateFilters = () => {
    if (fromDate && toDate) {
      const isValid = isValidDateRange(
        fromDate,
        toDate,
        (message) => {
          toast.error(t("messages.invalidDateRange"), {
            description: message,
          });
        },
        -1,
        tCommon
      );

      if (!isValid) return false;
    }

    setFilters((prev) => ({
      ...prev,
      fromDate: fromDate,
      toDate: toDate,
    }));

    table.setPageIndex(0);
    return true;
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setFilters((prev) => ({
      ...prev,
      search: value,
    }));
    table.setGlobalFilter(value);
    table.setPageIndex(0);
  };

  return (
    <Collapsible>
      <div className="scheduled-report-table-head flex flex-wrap items-center justify-between p-4">
        <h2>{t("title")}</h2>
        <div className="flex flex-wrap items-center gap-2">
          <TooltipProvider>
            <div className="actions flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={tCommon("search.placeholder")}
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="ps-9 w-[200px]"
                />
              </div>
              <Tooltip>
                <CollapsibleTrigger asChild>
                  <TooltipTrigger asChild>
                    <Toggle pressed={true} className="rounded-full">
                      <FilterAltOutlined />
                    </Toggle>
                  </TooltipTrigger>
                </CollapsibleTrigger>
                <TooltipContent>
                  <p>{t("tooltips.toggleFilters")}</p>
                </TooltipContent>
              </Tooltip>
              <Button asChild>
                <Link href="/reports/scheduled/create-report">
                  <Plus className="h-4 w-4" />
                  {t("actions.createReport")}
                </Link>
              </Button>
            </div>
          </TooltipProvider>
        </div>
      </div>
      <CollapsibleContent>
        <FilterBar
          onClear={() => {
            setFilters({});
            setFromDate(undefined);
            setToDate(undefined);
            setSearch("");
            setFrequency("");
            setStatus("");
            table.setGlobalFilter("");
            table.setColumnFilters([]);
            table.setPageIndex(0);
          }}
        >
          {/* Creation Date Filter */}
          <FilterBox
            triggerLabel={t("filters.creationDate.triggerLabel")}
            label={t("filters.creationDate.label")}
            onReset={() => {
              setFilters((prev) => ({
                ...prev,
                fromDate: undefined,
                toDate: undefined,
              }));
              setFromDate(undefined);
              setToDate(undefined);
              table.setPageIndex(0);
            }}
            onApply={applyDateFilters}
            numberOfFilters={(fromDate ? 1 : 0) + (toDate ? 1 : 0)}
          >
            <Field
              label={t("filters.fromDate.label")}
              hint={t("filters.fromDate.hint")}
              postIcon={<Calendar className="text-gray-400" />}
            >
              <DatePicker
                className="flex-1"
                placeholder={t("filters.fromDate.placeholder")}
                value={fromDate}
                onChange={(date) => setFromDate(date || undefined)}
              />
            </Field>
            <Field
              label={t("filters.toDate.label")}
              hint={t("filters.toDate.hint")}
              postIcon={<Calendar className="text-gray-400" />}
            >
              <DatePicker
                className="flex-1"
                placeholder={t("filters.toDate.placeholder")}
                value={toDate}
                onChange={(date) => setToDate(date || undefined)}
              />
            </Field>
          </FilterBox>

          {/* Frequency Filter */}
          <FilterBox
            triggerLabel={t("filters.scheduled.triggerLabel")}
            label={t("filters.scheduled.label")}
            onReset={() => {
              setFrequency("");
              setFilters((prev) => ({
                ...prev,
                frequency: undefined,
              }));
              table.setColumnFilters((prev) =>
                prev.filter((col) => col.id !== "frequency")
              );
              table.setPageIndex(0);
            }}
            onApply={() => {
              setFilters((prev) => ({
                ...prev,
                frequency: frequency as ScheduledReportFilters["frequency"],
              }));
              table.setColumnFilters((prev) => [
                ...prev.filter((col) => col.id !== "frequency"),
                ...(frequency ? [{ id: "frequency", value: frequency }] : []),
              ]);
              table.setPageIndex(0);
              return true;
            }}
            numberOfFilters={frequency ? 1 : 0}
          >
            <RadioGroup value={frequency} onValueChange={setFrequency}>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="daily" id="daily" />
                <Label htmlFor="daily">{t("filters.scheduled.options.daily")}</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="weekly" id="weekly" />
                <Label htmlFor="weekly">{t("filters.scheduled.options.weekly")}</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly">{t("filters.scheduled.options.monthly")}</Label>
              </div>
            </RadioGroup>
          </FilterBox>

          {/* Status Filter */}
          <FilterBox
            triggerLabel={t("filters.status.triggerLabel")}
            label={t("filters.status.label")}
            onReset={() => {
              setStatus("");
              setFilters((prev) => ({
                ...prev,
                status: undefined,
              }));
              table.setColumnFilters((prev) =>
                prev.filter((col) => col.id !== "status")
              );
              table.setPageIndex(0);
            }}
            onApply={() => {
              setFilters((prev) => ({
                ...prev,
                status: status as ScheduledReportFilters["status"],
              }));
              table.setColumnFilters((prev) => [
                ...prev.filter((col) => col.id !== "status"),
                ...(status ? [{ id: "status", value: status }] : []),
              ]);
              table.setPageIndex(0);
              return true;
            }}
            numberOfFilters={status ? 1 : 0}
          >
            <RadioGroup value={status} onValueChange={setStatus}>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="active" id="active" />
                <Label htmlFor="active">{t("filters.status.options.active")}</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="inactive" id="inactive" />
                <Label htmlFor="inactive">{t("filters.status.options.inactive")}</Label>
              </div>
            </RadioGroup>
          </FilterBox>
        </FilterBar>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ScheduledReportHead;
