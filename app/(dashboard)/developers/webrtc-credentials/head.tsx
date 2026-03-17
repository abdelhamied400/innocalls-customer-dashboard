"use client";

import { useTranslations } from "@/providers/TranslationProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, SearchIcon } from "lucide-react";
import { usePaginatedTable } from "@/components/Table/PaginatedTable";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { FilterBar } from "@/components/FilterBar";
import { FilterBox } from "@/components/FilterBox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Field from "@/components/ui/field";
import Link from "next/link";

const WebrtcTableHead = () => {
  const t = useTranslations("developers.webrtc");
  const tCommon = useTranslations("common");
  const { table } = usePaginatedTable();
  const [status, setStatus] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    table.getColumn("apiKey")?.setFilterValue(value || undefined);
  };

  const applyStatusFilter = () => {
    if (status === "") {
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
      <div className="flex flex-wrap items-center justify-between p-4 gap-2">
        <h1 className="text-xl font-semibold">{t("title")}</h1>
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

          <TooltipProvider>
            <Tooltip>
              <CollapsibleTrigger asChild>
                <TooltipTrigger asChild>
                  <Toggle pressed={true} className="rounded-full bg-transparent">
                    <FilterAltIcon />
                  </Toggle>
                </TooltipTrigger>
              </CollapsibleTrigger>
              <TooltipContent>
                <p>{t("tooltips.toggleFilters")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild>
                  <Link href="/developers/webrtc-credentials/create">
                    <Plus className="h-4 w-4" />
                    {t("actions.create")}
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("tooltips.createCredential")}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <CollapsibleContent>
        <FilterBar
          onClear={() => {
            setStatus("");
            table.resetColumnFilters();
            setSearchTerm("");
          }}
        >
          <FilterBox
            triggerLabel={t("filters.status.label")}
            label={t("filters.status.selectLabel")}
            onReset={resetStatusFilter}
            onApply={applyStatusFilter}
            numberOfFilters={status ? 1 : 0}
          >
            <RadioGroup value={status} onValueChange={setStatus}>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="active" id="webrtc-status-active" />
                <Label htmlFor="webrtc-status-active">
                  {tCommon("status.active")}
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem
                  value="inactive"
                  id="webrtc-status-inactive"
                />
                <Label htmlFor="webrtc-status-inactive">
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

export default WebrtcTableHead;
