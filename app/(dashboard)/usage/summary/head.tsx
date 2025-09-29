"use client";

import { useState } from "react";
import Field from "@/components/ui/field";
import { CalendarIcon } from "lucide-react";
import { UsageSummaryFilters } from "@/services/usage.service";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Toggle } from "@/components/ui/toggle";
import { FilterAltOutlined } from "@mui/icons-material";
import DatePicker from "@/components/ui/date-picker";
import { FilterBar } from "@/components/FilterBar";
import { FilterBox } from "@/components/FilterBox";
import { isValidDateRange } from "@/lib/date";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { usePaginatedTable } from "@/components/Table/PaginatedTable";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTranslations } from "@/providers/TranslationProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const t = useTranslations("usage.summary");
  const tUsageCommon = useTranslations("usage.common");
  const tCommon = useTranslations("common");

  const applyFilters = () => {
    const isValidRange = isValidDateRange(
      fromDate,
      toDate,
      (message) => {
        toast({
          title: t("messages.invalidDateRange"),
          description: message,
          variant: "destructive",
        });
      },
      30,
      tCommon
    );

    if (!isValidRange) return false;

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
    return true;
  };

  return (
    <Collapsible>
      <div className="usage-summary-table-head flex flex-wrap items-center justify-between p-4">
        <h2>{t("title")}</h2>
        <TooltipProvider>
          <div className="actions flex flex-wrap items-center gap-2">
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
      <CollapsibleContent>
        <FilterBar
          onClear={() => {
            setFilters(defaultFilters);
            setFromDate(defaultFromDate);
            setToDate(defaultToDate);
            setGroupBy([]);
            setSummaryBy("");
            table.setPageIndex(0); // Reset to first page on filter change
          }}
        >
          <FilterBox
            triggerLabel={t("filters.creationDate.label")}
            label={t("filters.creationDate.placeholder")}
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
              label={tUsageCommon("filters.fromDate.label")}
              hint={tUsageCommon("filters.fromDate.hint")}
              postIcon={<CalendarIcon className="text-gray-400" />}
            >
              <DatePicker
                className="flex-1"
                placeholder={tUsageCommon("filters.fromDate.placeholder")}
                value={fromDate}
                onChange={(date) => {
                  if (date) setFromDate(date);
                }}
              />
            </Field>
            <Field
              label={tUsageCommon("filters.toDate.label")}
              hint={tUsageCommon("filters.toDate.hint")}
              postIcon={<CalendarIcon className="text-gray-400" />}
            >
              <DatePicker
                className="flex-1"
                placeholder={tUsageCommon("filters.toDate.placeholder")}
                value={toDate}
                onChange={(date) => {
                  if (date) setToDate(date);
                }}
              />
            </Field>
          </FilterBox>
          <FilterBox
            triggerLabel={t("filters.showBy.triggerLabel")}
            label={t("filters.showBy.label")}
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
              <Label>{t("showBy.serviceName")}</Label>
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
              <Label>{t("showBy.accountName")}</Label>
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
              <Label>{t("showBy.packageName")}</Label>
            </div>
          </FilterBox>
          <FilterBox
            triggerLabel={t("filters.summaryBy.triggerLabel")}
            label={t("filters.summaryBy.label")}
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
              <div className="flex items-center gap-2">
                <RadioGroupItem value="" id="general" />
                <Label htmlFor="general">{t("summaryBy.general")}</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="dateDay" id="dateDay" />
                <Label htmlFor="dateDay">{t("summaryBy.byDay")}</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="dateMonth" id="dateMonth" />
                <Label htmlFor="dateMonth">{t("summaryBy.byMonth")}</Label>
              </div>
            </RadioGroup>
          </FilterBox>
        </FilterBar>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default UsageSummaryHead;
