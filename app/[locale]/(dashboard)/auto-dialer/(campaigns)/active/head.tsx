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
import { useCallback, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { debounce } from "@/lib/debounce";
import Link from "next/link";
import { cn } from "@/lib/utils";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ChevronDownIcon from "@mui/icons-material/ExpandMore";
import CalendarMonthIcon from "@mui/icons-material/CalendarToday";

const AutoDialerActiveHead = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const getCreationDateFilterCount = useCallback(() => {
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    if (from && to) {
      return 2;
    } else if (from || to) {
      return 1;
    }
    return 0;
  }, [searchParams]);

  const getFilter = useCallback(
    (key: string) => {
      const value = searchParams.get(key);
      if (value) return value.toString();
      return "";
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams]
  );

  const updateFilter = useCallback(
    debounce((key: string, value: string) => {
      startTransition(() => {
        let params: URLSearchParams = new URLSearchParams(searchParams);

        if (value) params.set(key, value);
        else params.delete(key);

        router.push(`?${params.toString()}`);
      });
    }, 0),
    [searchParams, router]
  );

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
                defaultValue={searchParams.get("search")?.toString()}
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
          <div className="flex items-center gap-4 p-3 border-t table-filters">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="filter" size="filter">
                  Creation Date
                  <Badge
                    variant="outline"
                    className="bg-neutral-500 px-1.5 rounded-md text-white"
                  >
                    {/* filters count */}
                    {getCreationDateFilterCount()}
                  </Badge>
                  <ChevronDownIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <FilterDialog title="Select a date range">
                  <Field
                    label="From"
                    hint="DD/MM/YYYY"
                    postIcon={<CalendarMonthIcon className="text-gray-400" />}
                  >
                    <DatePicker
                      className="flex-1"
                      placeholder="Enter from date"
                      value={
                        getFilter("from")
                          ? new Date(getFilter("from"))
                          : undefined
                      }
                      onChange={(date = new Date()) =>
                        updateFilter("from", format(date, "yyyy-MM-dd"))
                      }
                    />
                  </Field>
                  <Field
                    label="To"
                    hint="DD/MM/YYYY"
                    postIcon={<CalendarMonthIcon className="text-gray-400" />}
                  >
                    <DatePicker
                      className="flex-1"
                      placeholder="Enter to date"
                      value={
                        getFilter("to") ? new Date(getFilter("to")) : undefined
                      }
                      onChange={(date = new Date()) =>
                        updateFilter("to", format(date, "yyyy-MM-dd"))
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
