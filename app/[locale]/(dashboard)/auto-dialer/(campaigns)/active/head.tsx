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
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CalendarIcon from "@mui/icons-material/CalendarToday";
import { FilterBar } from "@/components/FilterBar";
import { FilterBox } from "@/components/FilterBox";
import { useState } from "react";

type AutoDialerActiveHeadProps = {
  filters: Record<string, string>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>;
};
const AutoDialerActiveHead = ({
  filters,
  setFilters,
}: AutoDialerActiveHeadProps) => {
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);

  return (
    <Collapsible>
      <div className="table-head">
        <div className="flex justify-between items-center gap-4 p-3">
          <h3>Active Campaigns</h3>
          <div className="flex items-center gap-4 actions">
            <Field preIcon={<SearchIcon className="text-muted-foreground" />}>
              <Input
                placeholder="Search"
                type="search"
                variant="field"
                value={filters.search || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setFilters((prev) => ({
                    ...prev,
                    search: value,
                  }));
                }}
              />
            </Field>
            <CollapsibleTrigger asChild>
              <Toggle pressed={true} className="rounded-full">
                <FilterAltIcon />
              </Toggle>
            </CollapsibleTrigger>
            <Link className={cn(buttonVariants())} href="/auto-dialer/create">
              Create new campaign
            </Link>
          </div>
        </div>
        <CollapsibleContent>
          <FilterBar
            onClear={() => {
              setFromDate(undefined);
              setToDate(undefined);
              setFilters({});
            }}
          >
            <FilterBox
              triggerLabel="Creation Date"
              label="Select a date range"
              onReset={() => {
                setFilters((prev) => ({
                  ...prev,
                  fromDate: undefined,
                  toDate: undefined,
                }));
              }}
              onApply={() => {
                setFilters((prev) => ({
                  ...prev,
                  fromDate: fromDate
                    ? format(fromDate, "yyyy-MM-dd")
                    : undefined,
                  toDate: toDate ? format(toDate, "yyyy-MM-dd") : undefined,
                }));
              }}
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
          </FilterBar>

          {/* TODO: remove this if the new filter bar works  */}
          {/* <div className="flex justify-between items-center p-3 border-t table-filters">
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="filter" size="filter">
                    Creation Date
                    {getFilterCountForGroup("creation-date") > 0 && (
                      <Badge
                        variant="outline"
                        className="bg-neutral-500 px-1.5 rounded-md text-white"
                      >
                        {getFilterCountForGroup("creation-date")}
                      </Badge>
                    )}
                    <ChevronDownIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <FilterDialog
                    title="Select a date range"
                    onReset={() => {
                      setCreationDate({
                        from: undefined,
                        to: undefined,
                      });
                      clearGroup("creation-date");
                    }}
                    onApply={() => {
                      updateFilters({
                        "creation-date.from": creationDate.from
                          ? format(creationDate.from, "yyyy-MM-dd")
                          : undefined,
                        "creation-date.to": creationDate.to
                          ? format(creationDate.to, "yyyy-MM-dd")
                          : undefined,
                      });
                    }}
                  >
                    <Field
                      label="From"
                      hint="DD/MM/YYYY"
                      postIcon={<CalendarIcon className="text-gray-400" />}
                    >
                      <DatePicker
                        className="flex-1"
                        placeholder="Enter from date"
                        value={creationDate.from}
                        onChange={(date) =>
                          setCreationDate((prev) => ({
                            ...prev,
                            from: date || undefined,
                          }))
                        }
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
                        value={creationDate.to}
                        onChange={(date) =>
                          setCreationDate((prev) => ({
                            ...prev,
                            to: date || undefined,
                          }))
                        }
                      />
                    </Field>
                  </FilterDialog>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="filter" size="filter">
                    Duration Type
                    {getFilterCountForGroup("duration-type") > 0 && (
                      <Badge
                        variant="outline"
                        className="bg-neutral-500 px-1.5 rounded-md text-white"
                      >
                        {getFilterCountForGroup("duration-type")}
                      </Badge>
                    )}
                    <ChevronDownIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <FilterDialog
                    title="Select from the list"
                    onReset={() => {
                      setDurationType("");
                      clearGroup("duration-type");
                    }}
                    onApply={() => {
                      updateFilters({
                        "duration-type": durationType,
                      });
                    }}
                  >
                    <RadioGroup
                      defaultValue=""
                      onValueChange={setDurationType}
                      value={durationType}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="time-limited"
                          id="time-limited"
                        />
                        <Label htmlFor="time-limited">Time Limited</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="agent-availability"
                          id="agent-availability"
                        />
                        <Label htmlFor="agent-availability">
                          Agent Availability
                        </Label>
                      </div>
                    </RadioGroup>
                  </FilterDialog>
                </DropdownMenuContent>
              </DropdownMenu>
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
                setDurationType("");
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

export default AutoDialerActiveHead;
