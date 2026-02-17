"use client";
import { FilterBar } from "@/components/FilterBar";
import { FilterBox } from "@/components/FilterBox";
import { usePaginatedTable } from "@/components/Table/PaginatedTable";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import DatePicker from "@/components/ui/date-picker";
import Field from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import useDebounce from "@/hooks/use-debounce";
import { isValidDateRange } from "@/lib/date";
import { useTranslations } from "@/providers/TranslationProvider";
import { CalendarToday, FilterAltOutlined, Search } from "@mui/icons-material";
import { format } from "node:util";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type CampaignCdrsHeadProps = {
  filters: Record<string, string>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>;
};
const CampaignCdrsHead = ({ filters, setFilters }: CampaignCdrsHeadProps) => {
  const t = useTranslations("autoDialer.campaignCdrs");
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

  useEffect(() => {
    if (debouncedSearchTerm === (filters.name || "")) return;
    setFilters((prev) => ({
      ...prev,
      name: debouncedSearchTerm || undefined,
    }));
  }, [debouncedSearchTerm, filters.name, setFilters]);

  return (
    <Collapsible>
      <div className="table-head">
        <div className="flex justify-between items-center gap-4 p-3">
          <h3>Campaign Cdrs</h3>
          <div className="flex items-center gap-4 actions">
            <Field preIcon={<Search className="text-muted-foreground" />}>
              <Input
                placeholder="search..."
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
              triggerLabel="Creation Date"
              label="Creation Date"
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
                label="From"
                hint="Select the start date"
                postIcon={<CalendarToday className="text-gray-400" />}
              >
                <DatePicker
                  className="flex-1"
                  placeholder="Select start date"
                  value={fromDate}
                  onChange={(date) => setFromDate(date || undefined)}
                />
              </Field>
              <Field
                label="To"
                hint="Select the end date"
                postIcon={<CalendarToday className="text-gray-400" />}
              >
                <DatePicker
                  className="flex-1"
                  placeholder="Select end date"
                  value={toDate}
                  onChange={(date) => setToDate(date || undefined)}
                />
              </Field>
            </FilterBox>
          </FilterBar>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default CampaignCdrsHead;
