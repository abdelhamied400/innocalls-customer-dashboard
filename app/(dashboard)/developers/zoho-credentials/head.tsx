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
import zohoCredentialService from "@/services/zoho-credential.service";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import ApiKeyDialog from "../freshdesk-credentials/ApiKeyDialog";

const ZohoTableHead = () => {
  const t = useTranslations("developers.zoho");
  const tCommon = useTranslations("common");
  const { table } = usePaginatedTable();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);
  const [generatedApiKey, setGeneratedApiKey] = useState<string | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    table.setGlobalFilter(e.target.value);
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

  const handleCreate = async () => {
    try {
      setIsCreating(true);
      const result = await zohoCredentialService.create();
      setGeneratedApiKey(result.apiKey);
      queryClient.invalidateQueries({ queryKey: ["zoho-credentials"] });
      toast.success(t("messages.createSuccess"));
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(t("messages.createFailed"), {
          description: error.response?.data?.message,
        });
      } else {
        toast.error(t("messages.createFailed"));
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <Collapsible>
        <div className="flex flex-wrap items-center justify-between p-4 gap-2">
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

            <Button onClick={handleCreate} disabled={isCreating} loading={isCreating}>
              <Plus className="h-4 w-4" />
              {t("actions.create")}
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
              numberOfFilters={status ? 1 : 0}
            >
              <RadioGroup value={status} onValueChange={setStatus}>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="active" id="zoho-status-active" />
                  <Label htmlFor="zoho-status-active">
                    {tCommon("status.active")}
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    value="inactive"
                    id="zoho-status-inactive"
                  />
                  <Label htmlFor="zoho-status-inactive">
                    {tCommon("status.inactive")}
                  </Label>
                </div>
              </RadioGroup>
            </FilterBox>
          </FilterBar>
        </CollapsibleContent>
      </Collapsible>

      <ApiKeyDialog
        apiKey={generatedApiKey}
        onClose={() => setGeneratedApiKey(null)}
        translationNamespace="developers.zoho"
        downloadFileName="zoho-api-key.txt"
      />
    </>
  );
};

export default ZohoTableHead;
