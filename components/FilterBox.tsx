import { Button } from "@/components/ui/button";
import React, { PropsWithChildren, useState, useId } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/providers/TranslationProvider";
import { useFilterBar } from "./FilterBar";

type FilterBoxProps = PropsWithChildren<{
  className?: string;
  triggerLabel?: React.ReactNode;
  label?: string;
  onReset?: () => void;
  onApply?: () => boolean;
  numberOfFilters?: number;
}>;
export const FilterBox = ({
  className = "",
  triggerLabel = "Filter",
  children,
  label,
  onReset,
  onApply,
  numberOfFilters = 0,
}: FilterBoxProps) => {
  const t = useTranslations("common");
  const filterId = useId();
  const filterBarContext = useFilterBar();

  // Fallback to local state if not inside FilterBar context
  const [localIsOpen, setLocalIsOpen] = useState(false);

  const isOpen = filterBarContext
    ? filterBarContext.openFilterId === filterId
    : localIsOpen;

  const setIsOpen = (open: boolean) => {
    if (filterBarContext) {
      filterBarContext.setOpenFilterId(open ? filterId : null);
    } else {
      setLocalIsOpen(open);
    }
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    }
    setIsOpen(false);
  };

  const handleApply = () => {
    if (onApply) {
      const isApplied = onApply();
      if (isApplied) {
        setIsOpen(false);
      }
    } else {
      setIsOpen(false);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="filter" className="h-auto min-h-9 whitespace-normal">
          {triggerLabel}
          {numberOfFilters > 0 && (
            <Badge className="p-0.5" variant="gray">
              {numberOfFilters}
            </Badge>
          )}
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={cn(
          "p-0 rounded-lg overflow-y-auto max-w-sm max-h-96",
          className
        )}
      >
        <div className="flex flex-col gap-2 pt-2 min-w-72 filter-dialog">
          <h4 className="px-4 py-2 text-neutral-600 filter-dialog-header">
            {label}
          </h4>
          <div className="flex flex-col gap-2 filter-dialog-body">
            <div className="flex flex-col gap-4 px-4 py-2 filter-dialog-content">
              {children || (
                <p className="text-sm text-gray-500">
                  {t("filter.noFiltersAvailable")}
                </p>
              )}
            </div>
            <hr className="" />
            <div className="flex justify-between mb-2 filter-dialog-footer">
              <Button
                variant="unstyled"
                className="text-primary"
                onClick={handleReset}
              >
                {t("actions.reset")}
              </Button>
              <Button
                variant="unstyled"
                className="text-primary"
                onClick={handleApply}
              >
                {t("actions.apply")}
              </Button>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
