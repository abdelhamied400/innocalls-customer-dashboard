"use client";
import FilterDialog from "@/components/FilterDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { DataTable } from "@/components/ui/data-table";
import DatePicker from "@/components/ui/date-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Field from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { Calendar, ChevronDownIcon, FilterIcon } from "lucide-react";
import { useState } from "react";
import { columns } from "./columns";

type AutoDialerActiveTableProps = {};
const AutoDialerActiveTable = () => {
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);

  return (
    <div className="auto-dialer-active-table">
      <Collapsible>
        <div className="table-head">
          <div className="flex justify-between items-center gap-4 p-3">
            <h3>Active Campaigns</h3>
            <div className="flex items-center gap-4 actions">
              <Input placeholder="Search" type="search" />
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
              <div className="filter">
                <p>Expiration Date</p>
              </div>
              <div className="filter">
                <p>Status</p>
              </div>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      <DataTable columns={columns} data={[]} isLoading={false} />
    </div>
  );
};

export default AutoDialerActiveTable;
