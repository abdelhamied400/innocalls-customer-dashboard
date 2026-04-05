"use client";

import { useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/providers/TranslationProvider";
import { FilterBar } from "@/components/FilterBar";
import { FilterBox } from "@/components/FilterBox";
import Field from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import DatePicker from "@/components/ui/date-picker";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Search,
  FilterAltOutlined,
  CalendarToday,
} from "@mui/icons-material";
import { useEffect } from "react";
import useDebounce from "@/hooks/use-debounce";
import { usePaginatedTable } from "@/components/Table/PaginatedTable";
import { isValidDateRange } from "@/lib/date";
import { toast } from "sonner";
import { format } from "date-fns";

type CallSurveyActiveHeadProps = {
  filters: Record<string, any>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>;
};

const CallSurveyActiveHead = ({
  filters,
  setFilters,
}: CallSurveyActiveHeadProps) => {
  const t = useTranslations("callSurvey");
  const { table } = usePaginatedTable();
  const [searchTerm, setSearchTerm] = useState(filters.name || "");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [status, setStatus] = useState<string>(filters.status || "all");

  useEffect(() => {
    if (debouncedSearchTerm === (filters.name || "")) return;
    setFilters((prev) => ({
      ...prev,
      name: debouncedSearchTerm || undefined,
    }));
  }, [debouncedSearchTerm, filters.name, setFilters]);

  useEffect(() => {
    table.setPageIndex(0);
  }, [filters, table]);

  const applyDateFilter = () => {
    const isValid = isValidDateRange(fromDate, toDate, (message) => {
      toast.error("Invalid Date Range", { description: message });
    }, -1);
    if (!isValid) return false;

    setFilters((prev) => ({
      ...prev,
      fromDate: fromDate ? format(fromDate, "yyyy-MM-dd") : undefined,
      toDate: toDate ? format(toDate, "yyyy-MM-dd") : undefined,
    }));
    return true;
  };

  const statusOptions = [
    { value: "active", label: t("active.statuses.active") },
    { value: "paused", label: t("active.statuses.paused") },
    { value: "draft", label: t("active.statuses.draft") },
  ];

  return (
    <Collapsible>
      <div className="table-head">
        <div className="flex justify-between items-center gap-4 p-3">
          <h3>{t("active.title")}</h3>
          <div className="flex items-center gap-4 actions">
            <Field preIcon={<Search className="text-muted-foreground" />}>
              <Input
                placeholder={t("active.search")}
                type="search"
                variant="field"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Field>
            <TooltipProvider>
              <Tooltip>
                <CollapsibleTrigger asChild>
                  <TooltipTrigger asChild>
                    <Toggle
                      pressed={true}
                      className="rounded-full bg-transparent"
                    >
                      <FilterAltOutlined />
                    </Toggle>
                  </TooltipTrigger>
                </CollapsibleTrigger>
                <TooltipContent>
                  <p>{t("active.filters.toggle")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Link
              className={cn(buttonVariants())}
              href="/call-survey/create"
            >
              {t("active.create")}
            </Link>
          </div>
        </div>
        <CollapsibleContent>
          <FilterBar
            onClear={() => {
              setFromDate(undefined);
              setToDate(undefined);
              setStatus("all");
              setSearchTerm("");
              setFilters({});
            }}
          >
            <FilterBox
              triggerLabel={t("active.filters.creationDate.placeholder")}
              label={t("active.filters.creationDate.label")}
              onReset={() => {
                setFromDate(undefined);
                setToDate(undefined);
                setFilters((prev) => ({
                  ...prev,
                  fromDate: undefined,
                  toDate: undefined,
                }));
              }}
              onApply={applyDateFilter}
              numberOfFilters={(fromDate ? 1 : 0) + (toDate ? 1 : 0)}
            >
              <Field
                label={t("active.filters.creationDate.from.label")}
                hint={t("active.filters.creationDate.from.hint")}
                postIcon={<CalendarToday className="text-gray-400" />}
              >
                <DatePicker
                  className="flex-1"
                  placeholder={t(
                    "active.filters.creationDate.from.placeholder",
                  )}
                  value={fromDate}
                  onChange={(date) => setFromDate(date || undefined)}
                />
              </Field>
              <Field
                label={t("active.filters.creationDate.to.label")}
                hint={t("active.filters.creationDate.to.hint")}
                postIcon={<CalendarToday className="text-gray-400" />}
              >
                <DatePicker
                  className="flex-1"
                  placeholder={t(
                    "active.filters.creationDate.to.placeholder",
                  )}
                  value={toDate}
                  onChange={(date) => setToDate(date || undefined)}
                />
              </Field>
            </FilterBox>

            <FilterBox
              triggerLabel={t("active.filters.status.placeholder")}
              label={t("active.filters.status.label")}
              onReset={() => {
                setStatus("all");
                setFilters((prev) => ({ ...prev, status: undefined }));
              }}
              onApply={() => {
                setFilters((prev) => ({
                  ...prev,
                  status: status === "all" ? undefined : status,
                }));
                return true;
              }}
              numberOfFilters={status !== "all" ? 1 : 0}
            >
              <RadioGroup value={status} onValueChange={setStatus}>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="all" id="survey-status-all" />
                  <Label htmlFor="survey-status-all">
                    {t("active.filters.status.all")}
                  </Label>
                </div>
                {statusOptions.map((option) => (
                  <div className="flex items-center gap-2" key={option.value}>
                    <RadioGroupItem
                      value={option.value}
                      id={`survey-status-${option.value}`}
                    />
                    <Label htmlFor={`survey-status-${option.value}`}>
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </FilterBox>
          </FilterBar>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default CallSurveyActiveHead;
