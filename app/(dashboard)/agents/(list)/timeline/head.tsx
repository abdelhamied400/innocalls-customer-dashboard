import { usePaginatedTable } from "@/components/Table/PaginatedTable";
import { useTranslations } from "@/providers/TranslationProvider";
import { TimelineFilters } from "./table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Toggle } from "@/components/ui/toggle";
import { CalendarMonth, FilterAlt, Search } from "@mui/icons-material";
import { FilterBar } from "@/components/FilterBar";
import { FilterBox } from "@/components/FilterBox";
import Field from "@/components/ui/field";
import DatePicker from "@/components/ui/date-picker";
import { useState } from "react";
import MultiSelect from "@/components/oldselect";
import { useVocab } from "@/hooks/useVocab";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";

type TimelineHeadProps = {
  filters: TimelineFilters;
  setFilters: React.Dispatch<React.SetStateAction<TimelineFilters>>;
};

// TODO: PLZ CHECK THIS PAGE (ADDO)

const TimelineHead = ({ filters, setFilters }: TimelineHeadProps) => {
  const t = useTranslations("users.timeline");
  const searchT = useTranslations("common.search");
  const { table } = usePaginatedTable();

  const [name, setName] = useState("");
  const [fromDate, setFromDate] = useState<Date>(new Date(filters.fromDate));
  const [toDate, setToDate] = useState<Date>(new Date(filters.toDate));
  // ✅ Changed to use the same pattern as working tags
  const [selectedExts, setSelectedExts] = useState<
    { label: string; value: string }[]
  >([]);
  const [includeInternalCalls, setIncludeInternalCalls] = useState(false);

  const { extensions } = useVocab();
  const extensionsOptions = extensions?.map((ext) => ({
    label: `${ext.name} (${ext.ext})`,
    value: ext.ext,
  }));

  const applyFilters = () => {
    setFilters((prev: any) => ({
      ...prev,
      fromDate: fromDate ? format(fromDate, "yyyy-MM-dd") : "",
      toDate: toDate ? format(toDate, "yyyy-MM-dd") : "",
      // ✅ Use selectedExts instead of exts
      exts:
        selectedExts?.length > 0
          ? selectedExts.map((e) => e.value).join(",")
          : undefined,
      includeInternalCalls,
    }));
    table.setPageIndex(0); // Reset to first page on filter change

    return true;
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    table.setGlobalFilter(value);
    table.setPageIndex(0); // Reset to first page on search change
  };

  return (
    <Collapsible>
      <div className="users-table-head flex flex-wrap items-center justify-between p-4">
        <h2>{t("title")}</h2>
        <TooltipProvider>
          <div className="actions flex flex-wrap items-center gap-2">
            <Tooltip>
              <CollapsibleTrigger asChild>
                <TooltipTrigger asChild>
                  <Toggle pressed={true} className="rounded-full">
                    <FilterAlt />
                  </Toggle>
                </TooltipTrigger>
              </CollapsibleTrigger>
              <TooltipContent>
                <p>{t("tooltips.toggleFilters")}</p>
              </TooltipContent>
            </Tooltip>
            <Field preIcon={<Search />}>
              <Input
                variant="field"
                placeholder={searchT("placeholder")}
                value={name}
                onChange={handleSearchChange}
                type="search"
              />
            </Field>
          </div>
        </TooltipProvider>
      </div>
      <CollapsibleContent>
        <FilterBar
          onClear={() => {
            setFilters((prev: any) => ({
              ...prev,
              fromDate: format(new Date(), "yyyy-MM-dd"),
              toDate: format(new Date(), "yyyy-MM-dd"),
              exts: undefined,
              includeInternalCalls: false,
            }));
            setName("");
            setFromDate(new Date());
            setToDate(new Date());
            // ✅ Clear selectedExts array
            setSelectedExts([]);
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
              setFilters((prev: any) => ({
                ...prev,
                fromDate: format(new Date(), "yyyy-MM-dd"),
                toDate: format(new Date(), "yyyy-MM-dd"),
              }));
              setFromDate(new Date());
              setToDate(new Date());
              table.setPageIndex(0); // Reset to first page on filter change
              table.resetColumnFilters();
            }}
            onApply={applyFilters}
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
              setFilters((prev: any) => ({
                ...prev,
                exts: undefined,
              }));
              // ✅ Clear selectedExts array
              setSelectedExts([]);
              table.setPageIndex(0); // Reset to first page on filter change
            }}
            onApply={applyFilters}
            // ✅ Use selectedExts length for number of filters
            numberOfFilters={selectedExts?.length}
          >
            <MultiSelect
              options={extensionsOptions}
              // ✅ Update selectedExts directly (same as tags pattern)
              onChange={(exs) => setSelectedExts(exs || [])}
              // ✅ Use selectedExts as value (same as tags pattern)
              value={selectedExts}
              isMulti
              badgeClassName="text-xs"
              getLabel={(option) => option?.label || ""}
              getValue={(option) => option?.value || ""}
            />
          </FilterBox>
        </FilterBar>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default TimelineHead;
