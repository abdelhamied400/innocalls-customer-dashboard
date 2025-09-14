import { usePaginatedTable } from "@/components/Table/PaginatedTable";
import { useTranslations } from "@/providers/TranslationProvider";
import { AgentsPerformanceFilters } from "./table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Toggle } from "@/components/ui/toggle";
import {
  CalendarMonth,
  CalendarMonthOutlined,
  FilterAlt,
} from "@mui/icons-material";
import { FilterBar } from "@/components/FilterBar";
import { FilterBox } from "@/components/FilterBox";
import Field from "@/components/ui/field";
import DatePicker from "@/components/ui/date-picker";
import { useState } from "react";
import MultiSelect from "@/components/select";
import { useVocab } from "@/hooks/useVocab";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

type AgentsPerformanceHeadProps = {
  filters: AgentsPerformanceFilters;
  setFilters: React.Dispatch<React.SetStateAction<AgentsPerformanceFilters>>;
};
const AgentsPerformanceHead = ({
  filters,
  setFilters,
}: AgentsPerformanceHeadProps) => {
  const t = useTranslations("users.agentPerformance");
  const { table } = usePaginatedTable();

  const [fromDate, setFromDate] = useState<Date>(new Date(filters.fromDate));
  const [toDate, setToDate] = useState<Date>(new Date(filters.toDate));
  const [exts, setExts] = useState<
    { label: string; value: string }[] | undefined
  >(undefined);
  const [includeInternalCalls, setIncludeInternalCalls] = useState(false);

  const { extensions } = useVocab();
  const extensionsOptions = extensions?.map((ext) => ({
    label: `${ext.name} (${ext.ext})`,
    value: ext.ext,
  }));

  const applyFilters = () => {
    setFilters((prev) => ({
      ...prev,
      fromDate: fromDate ? format(fromDate, "yyyy-MM-dd") : "",
      toDate: toDate ? format(toDate, "yyyy-MM-dd") : "",
      exts: exts?.map((e) => e.value).join(",") || undefined,
      includeInternalCalls,
    }));
    table.setPageIndex(0); // Reset to first page on filter change
  };

  return (
    <Collapsible>
      <div className="users-table-head flex flex-wrap items-center justify-between p-4">
        <h2>{t("title")}</h2>
        <div className="actions flex flex-wrap items-center gap-2">
          <CollapsibleTrigger asChild>
            <Toggle pressed={true} className="rounded-full">
              <FilterAlt />
            </Toggle>
          </CollapsibleTrigger>
        </div>
      </div>
      <CollapsibleContent>
        <FilterBar
          onClear={() => {
            setFilters((prev) => ({
              ...prev,
              fromDate: format(new Date(), "yyyy-MM-dd"),
              toDate: format(new Date(), "yyyy-MM-dd"),
              exts: undefined,
              includeInternalCalls: false,
            }));
            setFromDate(new Date());
            setToDate(new Date());
            setExts([]);
            setIncludeInternalCalls(false);
            table.resetColumnFilters();
            table.setGlobalFilter("");
            table.setPageIndex(0); // Reset to first page on filter change
          }}
        >
          <FilterBox
            triggerLabel={t("filters.date.triggerLabel")}
            label={t("filters.selectFromList")}
            onReset={() => {
              setFilters((prev) => ({
                ...prev,
              }));
              table.resetColumnFilters();
            }}
            onApply={() => applyFilters}
          >
            <Field
              label={t("filters.date.label")}
              hint={t("filters.date.hint")}
              postIcon={<CalendarMonth className="text-gray-400" />}
            >
              <DatePicker
                className="flex-1"
                placeholder={t("filters.date.placeholder")}
                value={fromDate}
                onChange={(date) => {
                  setFromDate(date || new Date());
                  setToDate(date || new Date());
                }}
              />
            </Field>
          </FilterBox>

          <FilterBox
            triggerLabel={t("filters.exts.triggerLabel")}
            label={t("filters.exts.label")}
            onReset={() => {
              setFilters((prev) => ({
                ...prev,
                exts: undefined,
              }));
              setExts(undefined);
              table.setPageIndex(0); // Reset to first page on filter change
            }}
            onApply={applyFilters}
            numberOfFilters={exts?.length}
          >
            <MultiSelect
              options={extensionsOptions}
              onChange={(exs) => setExts(exs || undefined)}
              value={exts}
              isMulti
              badgeClassName="text-xs"
              getLabel={(option) => option?.label || ""}
              getValue={(option) => option?.value || ""}
            />
          </FilterBox>

          <FilterBox
            triggerLabel={t("filters.includeInternalCalls.triggerLabel")}
            label={t("filters.includeInternalCalls.label")}
            onReset={() => {
              setFilters((prev) => ({
                ...prev,
                includeInternalCalls: false,
              }));
              setIncludeInternalCalls(false);
              table.setPageIndex(0); // Reset to first page on filter change
            }}
            onApply={applyFilters}
            numberOfFilters={includeInternalCalls ? 1 : 0}
          >
            <div className="flex items-center space-x-2">
              <Switch
                id="includeInternalCalls"
                checked={includeInternalCalls}
                onCheckedChange={setIncludeInternalCalls}
              />
              <Label htmlFor="includeInternalCalls">
                {t("filters.includeInternalCalls.label")}
              </Label>
            </div>
          </FilterBox>
        </FilterBar>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default AgentsPerformanceHead;
