"use client";

import Field from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import SearchIcon from "@mui/icons-material/Search";
import { useCallback } from "react";
import { useTranslations } from "@/providers/TranslationProvider";
import { usePaginatedTable } from "@/components/Table/PaginatedTable";

const NumbersTableHead = () => {
  const { table } = usePaginatedTable();
  const t = useTranslations("numbers");
  const tCommonSearch = useTranslations("common.search");

  const onSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      table.getColumn("number")?.setFilterValue(value);
    },
    [table]
  );

  return (
    <div className="number-table-head flex items-center justify-between p-4">
      <h2>{t("title")}</h2>
      <div className="searchbar">
        <Field preIcon={<SearchIcon />}>
          <Input
            variant="field"
            placeholder={tCommonSearch("placeholder")}
            value={
              (table.getColumn("number")?.getFilterValue() as string) ?? ""
            }
            onChange={onSearchChange}
            type="search"
          />
        </Field>
      </div>
    </div>
  );
};

export default NumbersTableHead;
