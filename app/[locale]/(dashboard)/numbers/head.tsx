"use client";

import Field from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useFilters } from "@/hooks/use-filters";
import SearchIcon from "@mui/icons-material/Search";
import { useCallback } from "react";
import { useTranslations } from "next-intl";

const NumbersTableHead = () => {
  const { updateFilters } = useFilters();
  const t = useTranslations("numbers");
  const tCommonSearch = useTranslations("common.search");

  const onSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const search = event.target.value;
      updateFilters({ search });
    },
    []
  );

  return (
    <div className="number-table-head flex items-center justify-between p-4">
      <h2>{t("title")}</h2>
      <div className="searchbar">
        <Field preIcon={<SearchIcon />}>
          <Input
            variant="field"
            placeholder={tCommonSearch("placeholder")}
            onChange={onSearchChange}
            type="search"
          />
        </Field>
      </div>
    </div>
  );
};

export default NumbersTableHead;
