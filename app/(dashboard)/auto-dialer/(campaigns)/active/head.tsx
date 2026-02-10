"use client";
import { buttonVariants } from "@/components/ui/button";
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
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Search, FilterAltOutlined, CalendarToday } from "@mui/icons-material";
import { FilterBar } from "@/components/FilterBar";
import { FilterBox } from "@/components/FilterBox";
import { useEffect, useState } from "react";
import { usePaginatedTable } from "@/components/Table/PaginatedTable";
import { isValidDateRange } from "@/lib/date";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { autoDialerCampaignActiveStatuses } from "@/constants/auto-dialer";
import { useTranslations } from "@/providers/TranslationProvider";
import useDebounce from "@/hooks/use-debounce";

type AutoDialerActiveHeadProps = {
  filters: Record<string, string>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>;
};
const AutoDialerActiveHead = ({
  filters,
  setFilters,
}: AutoDialerActiveHeadProps) => {
  const t = useTranslations("autoDialer");
  const { table } = usePaginatedTable();
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [durationType, setDurationType] = useState<string>();
  const [status, setStatus] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState(filters.name || "");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  useEffect(() => {
    if (debouncedSearchTerm === (filters.name || "")) return;
    setFilters((prev) => ({
      ...prev,
      name: debouncedSearchTerm || undefined,
    }));
  }, [debouncedSearchTerm, filters.name, setFilters]);

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

  // Reset pagination when filters change
  // This ensures that when filters are applied, the table starts from the first page
  useEffect(() => {
    table.setPageIndex(0);
  }, [filters, table]);

  return (
    <Collapsible>
      <div className="table-head">
        <div className="flex justify-between items-center gap-4 p-3">
          <h3>{t("activeCampaigns.title")}</h3>
          <div className="flex items-center gap-4 actions">
            <Field preIcon={<Search className="text-muted-foreground" />}>
              <Input
                placeholder={t("activeCampaigns.search")}
                type="search"
                variant="field"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </Field>
            <CollapsibleTrigger asChild>
              <Toggle pressed={true} className="rounded-full bg-transparent">
                <FilterAltOutlined />
              </Toggle>
            </CollapsibleTrigger>
            <Link className={cn(buttonVariants())} href="/auto-dialer/create">
              {t("activeCampaigns.create")}
            </Link>
          </div>
        </div>
        <CollapsibleContent>
          <FilterBar
            onClear={() => {
              setFromDate(undefined);
              setToDate(undefined);
              setDurationType(undefined);
              setStatus({});
              setSearchTerm("");
              setFilters({});
            }}
          >
            <FilterBox
              triggerLabel={t(
                "activeCampaigns.filters.creationDate.placeholder",
              )}
              label={t("activeCampaigns.filters.creationDate.label")}
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
                label={t("activeCampaigns.filters.creationDate.from.label")}
                hint={t("activeCampaigns.filters.creationDate.from.hint")}
                postIcon={<CalendarToday className="text-gray-400" />}
              >
                <DatePicker
                  className="flex-1"
                  placeholder={t(
                    "activeCampaigns.filters.creationDate.from.placeholder",
                  )}
                  value={fromDate}
                  onChange={(date) => setFromDate(date || undefined)}
                />
              </Field>
              <Field
                label={t("activeCampaigns.filters.creationDate.to.label")}
                hint={t("activeCampaigns.filters.creationDate.to.hint")}
                postIcon={<CalendarToday className="text-gray-400" />}
              >
                <DatePicker
                  className="flex-1"
                  placeholder={t(
                    "activeCampaigns.filters.creationDate.to.placeholder",
                  )}
                  value={toDate}
                  onChange={(date) => setToDate(date || undefined)}
                />
              </Field>
            </FilterBox>
            {/* duration type */}
            <FilterBox
              triggerLabel={t(
                "activeCampaigns.filters.durationType.placeholder",
              )}
              label={t("activeCampaigns.filters.durationType.label")}
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
                  durationType: durationType,
                }));
                return true;
              }}
              numberOfFilters={durationType ? 1 : 0}
            >
              <RadioGroup
                defaultValue=""
                onValueChange={setDurationType}
                value={durationType || ""}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="time-limited" id="time-limited" />
                  <Label htmlFor="time-limited">
                    {t(
                      "activeCampaigns.filters.durationType.options.timeLimited",
                    )}
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    value="agent-availability"
                    id="agent-availability"
                  />
                  <Label htmlFor="agent-availability">
                    {t(
                      "activeCampaigns.filters.durationType.options.agentAvailability",
                    )}
                  </Label>
                </div>
              </RadioGroup>
            </FilterBox>
            {/* status */}

            <FilterBox
              triggerLabel={t("activeCampaigns.filters.status.placeholder")}
              label={t("activeCampaigns.filters.status.label")}
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
                    .filter(([, value]) => value)
                    .map(([key]) => key),
                }));
                return true;
              }}
              numberOfFilters={Object.keys(status).length}
            >
              {autoDialerCampaignActiveStatuses(t).map((s) => (
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

export default AutoDialerActiveHead;
