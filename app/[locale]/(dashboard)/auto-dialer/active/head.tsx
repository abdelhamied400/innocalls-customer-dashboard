"use client";
import FilterDialog from "@/components/FilterDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import DatePicker from "@/components/ui/date-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Field from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import {
  Calendar,
  ChevronDownIcon,
  FilterIcon,
  SearchIcon,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useFilters } from "@/providers/AutoDialerFilterProvider";

const AutoDialerActiveHead = () => {
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const { updateFilter } = useFilters();

  return (
    <Collapsible>
      <div className="table-head">
        <div className="flex justify-between items-center gap-4 p-3">
          <h3>Active Campaigns</h3>
          <div className="flex items-center gap-4 actions">
            <Field
              preIcon={
                <SearchIcon className="text-muted-foreground" size={24} />
              }
            >
              <Input
                placeholder="Search"
                type="search"
                variant="field"
                onChange={() => updateFilter("search", "something")}
              />
            </Field>
            <CollapsibleTrigger asChild>
              <Toggle pressed={true} className="rounded-full">
                <FilterIcon size={24} />
              </Toggle>
            </CollapsibleTrigger>
            <Button>Create new campaign</Button>
          </div>
        </div>
        <CollapsibleContent>
          <div className="flex items-center gap-4 p-3 border-t table-filters">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="filter" size="filter">
                  Creation Date
                  <Badge
                    variant="outline"
                    className="bg-neutral-500 px-1 text-white"
                  >
                    1
                  </Badge>
                  <ChevronDownIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <FilterDialog title="Select a date range">
                  <Field
                    label="From"
                    hint="DD/MM/YYYY"
                    postIcon={<Calendar className="text-gray-400" />}
                  >
                    <DatePicker
                      placeholder="Enter from date"
                      value={fromDate}
                      onChange={(date) => setFromDate(date)}
                    />
                  </Field>
                  <Field
                    label="To"
                    hint="DD/MM/YYYY"
                    postIcon={<Calendar className="text-gray-400" />}
                  >
                    <DatePicker placeholder="Enter to date" />
                  </Field>
                </FilterDialog>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="filter" size="filter">
                  Duration Type
                  <ChevronDownIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <FilterDialog title="Select a date range">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="time-limited" />
                    <label
                      htmlFor="time-limited"
                      className="peer-disabled:opacity-70 font-medium leading-none peer-disabled:cursor-not-allowed"
                    >
                      Time Limited
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="agent-availability" />
                    <label
                      htmlFor="agent-availability"
                      className="peer-disabled:opacity-70 font-medium leading-none peer-disabled:cursor-not-allowed"
                    >
                      Agent Availability
                    </label>
                  </div>
                </FilterDialog>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="filter" size="filter">
                  Status
                  <ChevronDownIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <FilterDialog title="Select a date range">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="time-limited" />
                    <label
                      htmlFor="time-limited"
                      className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed"
                    >
                      Time Limited
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="agent-availability" />
                    <label
                      htmlFor="agent-availability"
                      className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed"
                    >
                      Agent Availability
                    </label>
                  </div>
                </FilterDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default AutoDialerActiveHead;
