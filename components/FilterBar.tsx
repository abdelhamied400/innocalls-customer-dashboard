"use client";
import { PropsWithChildren } from "react";
import { Button } from "./ui/button";
import { Close } from "@mui/icons-material";
import { useTranslations } from "next-intl";

type FilterBarProps = PropsWithChildren<{
  onClear?: () => void;
}>;
export const FilterBar = ({ children, onClear }: FilterBarProps) => {
  const t = useTranslations("common.actions");

  return (
    <div className="border-t px-4 py-3">
      <div className="flex items-center justify-between">
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
  );
};
