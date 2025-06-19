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
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CalendarIcon from "@mui/icons-material/CalendarToday";
import { FilterBar } from "@/components/FilterBar";
import { FilterBox } from "@/components/FilterBox";
import { useEffect, useState } from "react";
import { usePaginatedTable } from "@/components/Table/PaginatedTable";
import { isValidDateRange } from "@/lib/date";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { autoDialerCampaignFinishedStatuses } from "@/constants/auto-dialer";

type AutoDialerFinishedHeadProps = {
  filters: Record<string, string>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>;
};
const AutoDialerFinishedHead = ({
  filters,
  setFilters,
}: AutoDialerFinishedHeadProps) => {
  const { toast } = useToast();
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
        toast({
          title: "Invalid Date Range",
          description: message,
          variant: "destructive",
        });
      },
      -1
    );
    if (!isValid) return;

    setFilters((prev) => ({
      ...prev,
      fromDate: fromDate ? format(fromDate, "yyyy-MM-dd") : undefined,
      toDate: toDate ? format(toDate, "yyyy-MM-dd") : undefined,
    }));
  };

  // Reset pagination when filters change
  // This ensures that when filters are applied, the table starts from the first page
  useEffect(() => {
    table.setPageIndex(0);
  }, [filters]);

  return (
    <Collapsible>
      <div className="table-head">
        <div className="flex justify-between items-center gap-4 p-3">
          <h3>Finished Campaigns</h3>
          <div className="flex items-center gap-4 actions">
            <Field preIcon={<SearchIcon className="text-muted-foreground" />}>
              <Input
                placeholder="search by name..."
                type="search"
                variant="field"
                value={filters.name || ""}
                onChange={handleSearchChange}
              />
            </Field>
            <CollapsibleTrigger asChild>
              <Toggle pressed={true} className="rounded-full">
                <FilterAltIcon />
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
              setFilters({});
            }}
          >
            <FilterBox
              triggerLabel="Creation Date"
              label="Select a date range"
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
                hint="DD/MM/YYYY"
                postIcon={<CalendarIcon className="text-gray-400" />}
              >
                <DatePicker
                  className="flex-1"
                  placeholder="Enter from date"
                  value={fromDate}
                  onChange={(date) => setFromDate(date || undefined)}
                />
              </Field>
              <Field
                label="To"
                hint="DD/MM/YYYY"
                postIcon={<CalendarIcon className="text-gray-400" />}
              >
                <DatePicker
                  className="flex-1"
                  placeholder="Enter to date"
                  value={toDate}
                  onChange={(date) => setToDate(date || undefined)}
                />
              </Field>
            </FilterBox>
            {/* duration type */}
            <FilterBox
              triggerLabel="Duration Type"
              label="Select duration type"
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
              }}
              numberOfFilters={durationType ? 1 : 0}
            >
              <RadioGroup
                defaultValue=""
                onValueChange={setDurationType}
                value={durationType}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="time-limited" id="time-limited" />
                  <Label htmlFor="time-limited">Time Limited</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="agent-availability"
                    id="agent-availability"
                  />
                  <Label htmlFor="agent-availability">Agent Availability</Label>
                </div>
              </RadioGroup>
            </FilterBox>
            {/* status */}

            <FilterBox
              triggerLabel="Status"
              label="Select campaign status"
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
              }}
              numberOfFilters={Object.keys(status).length}
            >
              {autoDialerCampaignFinishedStatuses.map((s) => (
                <div className="flex items-center space-x-2" key={s.value}>
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

          {/* TODO: remove this if the new filter bar works  */}
          {/* <div className="flex justify-between items-center p-3 border-t table-filters">
            <div className="flex items-center gap-4">
              
            
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="filter" size="filter">
                    Status
                    {getFilterCountForGroup("status") > 0 && (
                      <Badge
                        variant="outline"
                        className="bg-neutral-500 px-1.5 rounded-md text-white"
                      >
                        {getFilterCountForGroup("status")}
                      </Badge>
                    )}
                    <ChevronDownIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <FilterDialog
                    title="Select from the list"
                    onReset={() => {
                      setStatus({});
                      clearGroup("status");
                    }}
                    onApply={() =>
                      updateFilters(
                        autoDialerCampaignActiveStatuses.reduce((acc, s) => {
                          acc[`status.${s.value}`] = status[s.value];
                          return acc;
                        }, {} as Record<string, string>)
                      )
                    }
                  >
                    {autoDialerCampaignActiveStatuses.map((s) => (
                      <div
                        className="flex items-center space-x-2"
                        key={s.value}
                      >
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
                  </FilterDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Button
              onClick={() => {
                clearAllFilters();
                setSearch("");
                setCreationDate({
                  from: undefined,
                  to: undefined,
                });
                setDurationType(undefined);
                setStatus({});
              }}
              variant="ghost"
            >
              <Clear /> Clear
            </Button>
          </div> */}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default AutoDialerFinishedHead;
