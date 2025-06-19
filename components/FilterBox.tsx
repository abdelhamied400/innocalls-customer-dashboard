import { Button } from "@/components/ui/button";
import { PropsWithChildren } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

type FilterBoxProps = PropsWithChildren<{
  className?: string;
  triggerLabel?: string;
  label?: string;
  onReset?: () => void;
  onApply?: () => void;
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
                {t("actions.reset")}
              </Button>
              <Button
                variant="unstyled"
                className="text-primary"
                onClick={onApply}
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
