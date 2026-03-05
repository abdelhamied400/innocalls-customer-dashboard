"use client";

import { useTranslations } from "@/providers/TranslationProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, SearchIcon } from "lucide-react";
import Link from "next/link";
import { usePaginatedTable } from "@/components/Table/PaginatedTable";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Toggle } from "@/components/ui/toggle";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { FilterBar } from "@/components/FilterBar";
import { FilterBox } from "@/components/FilterBox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Field from "@/components/ui/field";

const TagsTableHead = () => {
  const t = useTranslations("settings.call.tags");
  const tCommon = useTranslations("common");
  const { table } = usePaginatedTable();
  const [status, setStatus] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    table.setGlobalFilter(e.target.value);
  };

  const applyStatusFilter = () => {
    if (status === "" || status === "all") {
      table.getColumn("status")?.setFilterValue(undefined);
    } else if (status === "active") {
      table.getColumn("status")?.setFilterValue(false);
    } else if (status === "inactive") {
      table.getColumn("status")?.setFilterValue(true);
    }
    return true;
  };

  const resetStatusFilter = () => {
    setStatus("");
    table.getColumn("status")?.setFilterValue(undefined);
  };

  return (
    <Collapsible>
      <div className="tags-table-head flex flex-wrap items-center justify-between p-4 gap-2">
        <h3 className="text-sm font-semibold">{t("subtitle")}</h3>
        <div className="flex flex-wrap items-center gap-2">
          <Field preIcon={<SearchIcon />}>
            <Input
              variant="field"
              placeholder={tCommon("search.placeholder")}
              value={searchTerm}
              onChange={handleSearchChange}
              type="search"
            />
          </Field>

          <CollapsibleTrigger asChild>
            <Toggle pressed={true} className="rounded-full">
              <FilterAltIcon />
            </Toggle>
          </CollapsibleTrigger>

          <Button asChild>
            <Link href="/settings/call/create-tag">
              <Plus className="h-4 w-4" />
              {t("actions.create")}
            </Link>
          </Button>
        </div>
      </div>
      <CollapsibleContent>
        <FilterBar
          onClear={() => {
            setStatus("");
            table.resetColumnFilters();
            setSearchTerm("");
            table.setGlobalFilter("");
          }}
        >
          <FilterBox
            triggerLabel={t("filters.status.label")}
            label={t("filters.status.selectLabel")}
            onReset={resetStatusFilter}
            onApply={applyStatusFilter}
            numberOfFilters={status && status !== "all" ? 1 : 0}
          >
            <RadioGroup value={status} onValueChange={setStatus}>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="all" id="status-all" />
                <Label htmlFor="status-all">{t("filters.status.all")}</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="active" id="status-active" />
                <Label htmlFor="status-active">
                  {tCommon("status.active")}
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="inactive" id="status-inactive" />
                <Label htmlFor="status-inactive">
                  {tCommon("status.inactive")}
                </Label>
              </div>
            </RadioGroup>
          </FilterBox>
        </FilterBar>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default TagsTableHead;
