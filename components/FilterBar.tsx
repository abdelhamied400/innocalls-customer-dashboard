"use client";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import { Button } from "./ui/button";
import { Close } from "@mui/icons-material";
import { useTranslations } from "@/providers/TranslationProvider";
import { cn } from "@/lib/utils";

type FilterBarContextType = {
  openFilterId: string | null;
  setOpenFilterId: (id: string | null) => void;
  closeFilter: () => void;
};

const FilterBarContext = createContext<FilterBarContextType | null>(null);

export const useFilterBar = () => {
  return useContext(FilterBarContext);
};

type FilterBarProps = PropsWithChildren<{
  onClear?: () => void;
  className?: string;
}>;
export const FilterBar = ({ children, onClear, className }: FilterBarProps) => {
  const t = useTranslations("common.actions");
  const [openFilterId, setOpenFilterId] = useState<string | null>(null);

  const closeFilter = useCallback(() => {
    setOpenFilterId(null);
  }, []);

  return (
    <FilterBarContext.Provider
      value={{ openFilterId, setOpenFilterId, closeFilter }}
    >
      <div className={cn("border-t px-4 py-3", className)}>
        <div className="flex flex-wrap items-center justify-between">
          <div className="filters flex flex-wrap items-center gap-2">
            {children}
          </div>
          <div className="flex items-center">
            {onClear && (
              <Button
                variant="ghost"
                onClick={onClear}
                className="flex items-center bg-transparent"
              >
                <Close className="h-4 w-4" />
                {t("clear")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </FilterBarContext.Provider>
  );
};
