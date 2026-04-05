"use client";
import { FilterBar } from "@/components/FilterBar";
import { FilterBox } from "@/components/FilterBox";
import Select from "@/components/Select";
import { usePaginatedTable } from "@/components/Table/PaginatedTable";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Field from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { useTranslations } from "@/providers/TranslationProvider";
import { FilterAltOutlined } from "@mui/icons-material";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";

type SurveyCdrsHeadProps = {
  filters: Record<string, any>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>;
};

const SurveyCdrsHead = ({ filters, setFilters }: SurveyCdrsHeadProps) => {
  const t = useTranslations("callSurvey.cdrs");
  const { table } = usePaginatedTable();
  const menuPortalTarget =
    typeof window !== "undefined" ? document.body : undefined;

  const [selectedStatuses, setSelectedStatuses] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedCompletionStatuses, setSelectedCompletionStatuses] = useState<
    { label: string; value: string }[]
  >([]);
  const [phone, setPhone] = useState(filters.phone || "");

  const statuses = [
    "User did not answer",
    "Airplane Mode Enabled",
    "Call Failed",
    "User Busy/Rejected By User",
    "User Unreachable (Out of Network Coverage or Airplane Mode)",
    "Completed",
    "Timeout",
    "Abandoned",
  ];

  const statusOptions = statuses.map((s) => ({
    label: t(`statuses.${s}` as any) || s,
    value: s,
  }));

  const completionStatuses = ["complete", "partial", "no-response"];

  const completionStatusOptions = completionStatuses.map((s) => ({
    label: t(`completionStatuses.${s}` as any) || s,
    value: s,
  }));

  const applyFilters = () => {
    setFilters((prev) => ({
      ...prev,
      statuses:
        selectedStatuses.length > 0
          ? selectedStatuses.map((s) => s.value)
          : undefined,
      completionStatuses:
        selectedCompletionStatuses.length > 0
          ? selectedCompletionStatuses.map((s) => s.value)
          : undefined,
      phone: phone || undefined,
    }));
    return true;
  };

  const sanitizePhone = (value: string) => value.replace(/[^\d]/g, "");

  useEffect(() => {
    table.setPageIndex(0);
  }, [filters, table]);

  return (
    <Collapsible>
      <div className="table-head">
        <div className="flex justify-between items-center gap-4 p-3">
          <h3>{t("title")}</h3>
          <div className="flex items-center gap-4 actions">
            <TooltipProvider>
              <Tooltip>
                <CollapsibleTrigger asChild>
                  <TooltipTrigger asChild>
                    <Toggle
                      pressed={true}
                      className="rounded-full bg-transparent"
                    >
                      <FilterAltOutlined />
                    </Toggle>
                  </TooltipTrigger>
                </CollapsibleTrigger>
                <TooltipContent>
                  <p>{t("filters.toggle")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <CollapsibleContent>
          <FilterBar
            onClear={() => {
              setSelectedStatuses([]);
              setSelectedCompletionStatuses([]);
              setPhone("");
              setFilters({});
            }}
          >
            <FilterBox
              triggerLabel={t("filters.status")}
              label={t("filters.status")}
              onReset={() => {
                setSelectedStatuses([]);
                setFilters((prev) => ({
                  ...prev,
                  statuses: undefined,
                }));
              }}
              onApply={applyFilters}
              numberOfFilters={selectedStatuses.length}
            >
              <Select
                options={statusOptions}
                value={selectedStatuses}
                menuPortalTarget={menuPortalTarget}
                menuPosition="fixed"
                onChange={(options) =>
                  setSelectedStatuses(
                    (options as { label: string; value: string }[]) || [],
                  )
                }
                isMulti
                placeholder={t("filters.statusPlaceholder")}
              />
            </FilterBox>

            <FilterBox
              triggerLabel={t("filters.completionStatus")}
              label={t("filters.completionStatus")}
              onReset={() => {
                setSelectedCompletionStatuses([]);
                setFilters((prev) => ({
                  ...prev,
                  completionStatuses: undefined,
                }));
              }}
              onApply={applyFilters}
              numberOfFilters={selectedCompletionStatuses.length}
            >
              <Select
                options={completionStatusOptions}
                value={selectedCompletionStatuses}
                menuPortalTarget={menuPortalTarget}
                menuPosition="fixed"
                onChange={(options) =>
                  setSelectedCompletionStatuses(
                    (options as { label: string; value: string }[]) || [],
                  )
                }
                isMulti
                placeholder={t("filters.completionStatusPlaceholder")}
              />
            </FilterBox>

            <FilterBox
              triggerLabel={t("filters.phone")}
              label={t("filters.phone")}
              onReset={() => {
                setPhone("");
                setFilters((prev) => ({
                  ...prev,
                  phone: undefined,
                }));
              }}
              onApply={applyFilters}
              numberOfFilters={phone ? 1 : 0}
            >
              <Field
                label={t("filters.phoneLabel")}
                hint={t("filters.phoneHint")}
              >
                <Input
                  variant="field"
                  placeholder={t("filters.phonePlaceholder")}
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => setPhone(sanitizePhone(e.target.value))}
                />
              </Field>
            </FilterBox>
          </FilterBar>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default SurveyCdrsHead;
