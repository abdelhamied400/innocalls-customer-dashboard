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
import { useVocab } from "@/hooks/useVocab";
import { useTranslations } from "@/providers/TranslationProvider";
import autoDialerService from "@/services/auto-dialer.service";
import { CampaignCdr } from "@/types/autoDialerCampaign";
import { FilterAltOutlined } from "@mui/icons-material";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type CampaignCdrsHeadProps = {
  filters: Record<string, any>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>;
};

const CampaignCdrsHead = ({ filters, setFilters }: CampaignCdrsHeadProps) => {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations("autoDialer.campaignCdrs");
  const { table } = usePaginatedTable();
  const { extensions } = useVocab();
  const menuPortalTarget =
    typeof window !== "undefined" ? document.body : undefined;

  const [selectedStatuses, setSelectedStatuses] = useState<
    { label: string; value: CampaignCdr["status"] }[]
  >(
    Array.isArray(filters.statuses)
      ? filters.statuses.map((status: CampaignCdr["status"]) => ({
          label: status,
          value: status,
        }))
      : [],
  );
  const [selectedAgents, setSelectedAgents] = useState<
    { label: string; value: string }[]
  >(
    Array.isArray(filters.agents)
      ? filters.agents.map((extension: string) => ({
          label: extension,
          value: extension,
        }))
      : [],
  );
  const [phone, setPhone] = useState(filters.phone || "");

  const { data: campaign } = useQuery({
    queryKey: ["auto-dialer-campaign", id],
    queryFn: () => autoDialerService.getCampaign(id as string),
    enabled: !!id,
  });

  const statuses: CampaignCdr["status"][] = [
    "User did not answer",
    "Airplane Mode Enabled",
    "Initiated",
    "Processing",
    "Call Failed",
    "User Busy/Rejected By User",
    "User Connected",
    "User Unreachable (Out of Network Coverage or Airplane Mode)",
    "Completed",
    "Timeout",
    "Abandoned",
  ];

  const statusOptions = statuses.map((item) => ({
    label: t(`statuses.${item}`),
    value: item,
  }));

  const agentsVocab = useMemo(() => {
    const assignedIds = new Set((campaign?.assignedAgents || []).map(String));

    return extensions
      .filter((ext) => assignedIds.has(String(ext.ext)))
      .map((ext) => ({
        label: `${ext.name} (${ext.ext})`,
        value: String(ext.ext),
      }));
  }, [campaign?.assignedAgents, extensions]);

  const applyFilters = () => {
    setFilters((prev) => ({
      ...prev,
      statuses:
        selectedStatuses.length > 0
          ? selectedStatuses.map((item) => item.value)
          : undefined,
      agents:
        selectedAgents.length > 0
          ? selectedAgents.map((item) => item.value)
          : undefined,
      agent: undefined,
      phone: phone || undefined,
      status: undefined,
      fromDate: undefined,
      toDate: undefined,
      name: undefined,
    }));

    return true;
  };

  const sanitizePhone = (value: string) => {
    return value.replace(/[^\d]/g, "");
  };

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
                    <Toggle pressed={true} className="rounded-full bg-transparent">
                      <FilterAltOutlined />
                    </Toggle>
                  </TooltipTrigger>
                </CollapsibleTrigger>
                <TooltipContent>
                  <p>{t("tooltips.toggleFilters")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <CollapsibleContent>
          <FilterBar
            onClear={() => {
              setSelectedStatuses([]);
              setSelectedAgents([]);
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
                  status: undefined,
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
                    (options as {
                      label: string;
                      value: CampaignCdr["status"];
                    }[]) || [],
                  )
                }
                isMulti
                placeholder={t("filters.statusPlaceholder")}
              />
            </FilterBox>

            <FilterBox
              triggerLabel={t("filters.agent")}
              label={t("filters.agent")}
              onReset={() => {
                setSelectedAgents([]);
                setFilters((prev) => ({
                  ...prev,
                  agents: undefined,
                  agent: undefined,
                }));
              }}
              onApply={applyFilters}
              numberOfFilters={selectedAgents.length}
            >
              <Select
                options={agentsVocab}
                value={selectedAgents}
                menuPortalTarget={menuPortalTarget}
                menuPosition="fixed"
                onChange={(options) =>
                  setSelectedAgents(
                    (options as { label: string; value: string }[]) || [],
                  )
                }
                isMulti
                placeholder={t("filters.agentPlaceholder")}
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

export default CampaignCdrsHead;
