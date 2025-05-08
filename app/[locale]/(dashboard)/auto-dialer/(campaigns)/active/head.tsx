"use client";
import FilterDialog from "@/components/FilterDialog";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ChevronDownIcon from "@mui/icons-material/ExpandMore";
import CalendarIcon from "@mui/icons-material/CalendarToday";
import { useFilters } from "@/hooks/use-filters";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { autoDialerCampaignStatuses } from "@/constants/auto-dialer";
import { Clear } from "@mui/icons-material";

const AutoDialerActiveHead = () => {
  const {
    getFilter,
    updateFilter,
    getFilterCountForGroup,
    clearGroup,
    clearAllFilters,
  } = useFilters();

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
                value={getFilter("search")}
                onChange={(e) => updateFilter("search", e.target.value)}
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
          <div className="flex justify-between items-center p-3 border-t table-filters">
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
                    onReset={() => clearGroup("creation-date")}
                  >
                    <Field
                      label="From"
                      hint="DD/MM/YYYY"
                      postIcon={<CalendarIcon className="text-gray-400" />}
                    >
                      <DatePicker
                        className="flex-1"
                        placeholder="Enter from date"
                        value={
                          getFilter("creation-date.from")
                            ? new Date(getFilter("creation-date.from"))
                            : undefined
                        }
                        onChange={(date = new Date()) =>
                          updateFilter(
                            "creation-date.from",
                            format(date, "yyyy-MM-dd")
                          )
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
                        value={
                          getFilter("creation-date.to")
                            ? new Date(getFilter("creation-date.to"))
                            : undefined
                        }
                        onChange={(date = new Date()) =>
                          updateFilter(
                            "creation-date.to",
                            format(date, "yyyy-MM-dd")
                          )
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
                    onReset={() => clearGroup("duration-type")}
                  >
                    <RadioGroup
                      defaultValue=""
                      onValueChange={(value) =>
                        updateFilter("duration-type", value)
                      }
                      value={getFilter("duration-type")}
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
                    onReset={() => clearGroup("status")}
                  >
                    {autoDialerCampaignStatuses.map((status) => (
                      <div
                        className="flex items-center space-x-2"
                        key={status.value}
                      >
                        <Checkbox
                          id={status.value}
                          checked={
                            getFilter(`status.${status.value}`) === "true"
                          }
                          onCheckedChange={(checked) =>
                            updateFilter(`status.${status.value}`, checked)
                          }
                        />
                        <label
                          htmlFor={status.value}
                          className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed"
                        >
                          {status.label}
                        </label>
                      </div>
                    ))}
                  </FilterDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Button onClick={() => clearAllFilters()} variant="ghost">
              <Clear /> Clear
            </Button>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default AutoDialerActiveHead;
