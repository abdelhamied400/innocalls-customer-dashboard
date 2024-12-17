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
import { useState } from "react";

const ExtensionsTableHead = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="extensions-table-head">
      <Collapsible>
        <div className="flex justify-between items-center gap-2 px-4 py-2 border-b table-tob-bar">
          <h3 className="font-semibold">Extensions Table</h3>
          <div className="flex items-center gap-2 table-actions">
            <Field
              preIcon={
                <SearchIcon className="text-muted-foreground" size={24} />
              }
            >
              <Input placeholder="Search" type="search" variant="field" />
            </Field>
            <CollapsibleTrigger asChild>
              <Toggle pressed={true} className="rounded-full">
                <FilterIcon size={24} />
              </Toggle>
            </CollapsibleTrigger>

            <Button>Create Extension</Button>
          </div>
        </div>

        <CollapsibleContent>
          <div className="px-4 py-2 table-filters">
            <div className="extensions-filter">
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
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default ExtensionsTableHead;
