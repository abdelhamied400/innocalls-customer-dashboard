"use client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import DatePicker from "@/components/ui/date-picker";
import Field from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { format } from "date-fns";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAltOutlined";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CalendarIcon from "@mui/icons-material/CalendarToday";
import { FilterBar } from "@/components/FilterBar";
import { FilterBox } from "@/components/FilterBox";
import { useEffect, useState } from "react";
import { usePaginatedTable } from "@/components/Table/PaginatedTable";
import { isValidDateRange } from "@/lib/date";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { autoDialerCampaignFinishedStatuses } from "@/constants/auto-dialer";
import { useTranslations } from "@/providers/TranslationProvider";

type AutoDialerFinishedHeadProps = {
  filters: Record<string, string>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>;
};
const AutoDialerFinishedHead = ({
  filters,
  setFilters,
}: AutoDialerFinishedHeadProps) => {
  const t = useTranslations("autoDialer.finishedCampaigns");
  const st = useTranslations("autoDialer");
  const { table } = usePaginatedTable();
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [durationType, setDurationType] = useState<string>();
  const [status, setStatus] = useState<Record<string, string>>({});

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters((prev) => ({
      ...prev,
      name: value,
    }));
  };

  const applyFilters = () => {
    const isValid = isValidDateRange(
      fromDate,
      toDate,
      (message) => {
        toast.error("Invalid Date Range", {
          description: message,
        });
      },
      -1,
    );
    if (!isValid) return false;

    setFilters((prev) => ({
      ...prev,
      fromDate: fromDate ? format(fromDate, "yyyy-MM-dd") : undefined,
      toDate: toDate ? format(toDate, "yyyy-MM-dd") : undefined,
    }));
    return true;
  };

  useEffect(() => {
    table.setPageIndex(0);
  }, [filters]);

  return (
    <Collapsible>
      <div className="table-head">
        <div className="flex justify-between items-center gap-4 p-3">
          <h3>{t("title")}</h3>
          <div className="flex items-center gap-4 actions">
            <Field preIcon={<SearchIcon className="text-muted-foreground" />}>
              <Input
                placeholder={t("search")}
                type="search"
                variant="field"
                value={filters.name || ""}
                onChange={handleSearchChange}
              />
            </Field>
            <TooltipProvider>
              <Tooltip>
                <CollapsibleTrigger asChild>
                  <TooltipTrigger asChild>
                    <Toggle pressed={true} className="rounded-full">
                      <FilterAltIcon />
                    </Toggle>
                  </TooltipTrigger>
                </CollapsibleTrigger>
                <TooltipContent>
                  <p>{t("tooltips.toggleFilters")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <CollapsibleContent>
          <FilterBar
            onClear={() => {
              setFromDate(undefined);
              setToDate(undefined);
              setDurationType(undefined);
              setStatus({});
              setFilters({});
            }}
          >
            <FilterBox
              triggerLabel={t("filters.creationDate.placeholder")}
              label={t("filters.creationDate.label")}
              onReset={() => {
                setFromDate(undefined);
                setToDate(undefined);
                setFilters((prev) => ({
                  ...prev,
                  fromDate: undefined,
                  toDate: undefined,
                }));
              }}
              onApply={applyFilters}
              numberOfFilters={(fromDate ? 1 : 0) + (toDate ? 1 : 0)}
            >
              <Field
                label={t("filters.creationDate.from.label")}
                hint={t("filters.creationDate.from.hint")}
                postIcon={<CalendarIcon className="text-gray-400" />}
              >
                <DatePicker
                  className="flex-1"
                  placeholder={t("filters.creationDate.from.placeholder")}
                  value={fromDate}
                  onChange={(date) => setFromDate(date || undefined)}
                />
              </Field>
              <Field
                label={t("filters.creationDate.to.label")}
                hint={t("filters.creationDate.to.hint")}
                postIcon={<CalendarIcon className="text-gray-400" />}
              >
                <DatePicker
                  className="flex-1"
                  placeholder={t("filters.creationDate.to.placeholder")}
                  value={toDate}
                  onChange={(date) => setToDate(date || undefined)}
                />
              </Field>
            </FilterBox>
            <FilterBox
              triggerLabel={t("filters.durationType.placeholder")}
              label={t("filters.durationType.label")}
              onReset={() => {
                setDurationType(undefined);
                setFilters((prev) => ({
                  ...prev,
                  durationType: undefined,
                }));
              }}
              onApply={() => {
                setFilters((prev) => ({
                  ...prev,
                  durationType,
                }));
                return true;
              }}
              numberOfFilters={durationType ? 1 : 0}
            >
              <RadioGroup
                onValueChange={setDurationType}
                value={durationType || ""}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="time-limited" id="time-limited" />
                  <Label htmlFor="time-limited">
                    {st("activeCampaigns.durationTypes.time-limited")}
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    value="agent-availability"
                    id="agent-availability"
                  />
                  <Label htmlFor="agent-availability">
                    {st("activeCampaigns.durationTypes.agent-availability")}
                  </Label>
                </div>
              </RadioGroup>
            </FilterBox>
            <FilterBox
              triggerLabel={t("filters.status.placeholder")}
              label={t("filters.status.label")}
              onReset={() => {
                setStatus({});
                setFilters((prev) => ({
                  ...prev,
                  statuses: [],
                }));
              }}
              onApply={() => {
                setFilters((prev) => ({
                  ...prev,
                  statuses: Object.entries(status)
                    .filter(([_, value]) => value)
                    .map(([key, _]) => key),
                }));
                return true;
              }}
              numberOfFilters={Object.keys(status).length}
            >
              {autoDialerCampaignFinishedStatuses(st).map((s) => (
                <div className="flex items-center gap-2" key={s.value}>
                  <Checkbox
                    id={s.value}
                    checked={!!status[s.value]}
                    onCheckedChange={(checked) =>
                      setStatus((prev) => ({
                        ...prev,
                        [s.value]: checked as string,
                      }))
                    }
                  />
                  <label
                    htmlFor={s.value}
                    className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed"
                  >
                    {s.label}
                  </label>
                </div>
              ))}
            </FilterBox>
          </FilterBar>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default AutoDialerFinishedHead;
