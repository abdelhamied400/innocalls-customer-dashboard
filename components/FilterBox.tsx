import { Button } from "@/components/ui/button";
import { PropsWithChildren } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import { Badge } from "./ui/badge";

type FilterBoxProps = PropsWithChildren<{
  triggerLabel?: string;
  label?: string;
  onReset?: () => void;
  onApply?: () => void;
  numberOfFilters?: number;
}>;
export const FilterBox = ({
  triggerLabel = "Filter",
  children,
  label,
  onReset,
  onApply,
  numberOfFilters = 0,
}: FilterBoxProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="filter">
          {triggerLabel}
          {numberOfFilters > 0 && (
            <Badge className="p-0.5" variant="gray">
              {numberOfFilters}
            </Badge>
          )}
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-0 rounded-lg">
        <div className="flex flex-col gap-2 pt-2 min-w-72 filter-dialog">
          <h4 className="px-4 py-2 text-neutral-600 filter-dialog-header">
            {label}
          </h4>
          <div className="flex flex-col gap-2 filter-dialog-body">
            <div className="flex flex-col gap-4 px-4 py-2 filter-dialog-content max-h-64 overflow-y-auto">
              {children || (
                <p className="text-sm text-gray-500">No filters available</p>
              )}
            </div>
            <hr className="" />
            <div className="flex justify-between mb-2 filter-dialog-footer">
              <Button
                variant="unstyled"
                className="text-primary"
                onClick={onReset}
              >
                Reset
              </Button>
              <Button
                variant="unstyled"
                className="text-primary"
                onClick={onApply}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
