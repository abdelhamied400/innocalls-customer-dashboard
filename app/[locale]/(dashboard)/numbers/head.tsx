"use client";

import Field from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useFilters } from "@/hooks/use-filters";
import { debounce } from "@/lib/debounce";
import SearchIcon from "@mui/icons-material/Search";
import { useCallback } from "react";

const NumbersTableHead = () => {
  const { updateFilters } = useFilters();

  const onSearchChange = useCallback(
    debounce((event: React.ChangeEvent<HTMLInputElement>) => {
      const search = event.target.value;
      updateFilters({ search, page: 1 });
    }, 300),
    []
  );

  return (
    <div className="number-table-head flex items-center justify-between p-4">
      <h2>Numbers</h2>
      <div className="searchbar">
        <Field preIcon={<SearchIcon />}>
          <Input
            variant="field"
            placeholder="Search..."
            onChange={onSearchChange}
            type="search"
          />
        </Field>
      </div>
    </div>
  );
};

export default NumbersTableHead;
