"use client";

import { OneTimeReportFilters } from "@/types/api/report";
import { useState } from "react";
import Field from "@/components/ui/field";
import { FilterAltOutlined, Search } from "@mui/icons-material";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Toggle } from "@/components/ui/toggle";
import { Calendar } from "lucide-react";
import DatePicker from "@/components/ui/date-picker";
import { isValidDateRange } from "@/lib/date";
import { useToast } from "@/hooks/use-toast";
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

type OneTimeReportHeadProps = {
  filters: OneTimeReportFilters;
  setFilters: React.Dispatch<React.SetStateAction<OneTimeReportFilters>>;
};

const OneTimeReportHead = ({ filters, setFilters }: OneTimeReportHeadProps) => {
  const { toast } = useToast();
  const t = useTranslations("reports.oneTime");
  const tCommon = useTranslations("common");

  const { table } = usePaginatedTable();

  const [fromDate, setFromDate] = useState<Date | undefined>(filters.fromDate);
  const [toDate, setToDate] = useState<Date | undefined>(filters.toDate);
  const [search, setSearch] = useState<string>(filters.search || "");

  const applyFilters = () => {
    if (fromDate && toDate) {
      const isValid = isValidDateRange(
        fromDate,
        toDate,
        (message) => {
          toast({
            title: t("messages.invalidDateRange"),
            description: message,
            variant: "destructive",
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
    table.setPageIndex(0);
  };

  return (
    <Collapsible>
      <div className="one-time-report-table-head flex flex-wrap items-center justify-between p-4">
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
            table.setPageIndex(0);
          }}
        >
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
            onApply={applyFilters}
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
        </FilterBar>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default OneTimeReportHead;
