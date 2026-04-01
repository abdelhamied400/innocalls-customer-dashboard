"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/providers/TranslationProvider";
import { FilterBar } from "@/components/FilterBar";
import { FilterBox } from "@/components/FilterBox";
import VirtualizedSelect from "@/components/VirtualizedSelect";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useInfiniteQuery } from "@tanstack/react-query";
import callBridgeService from "@/services/call-bridge.service";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

type CallBridgeCallsHeadProps = {
  filters: Record<string, any>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>;
};

const CallBridgeCallsHead = ({
  filters,
  setFilters,
}: CallBridgeCallsHeadProps) => {
  const t = useTranslations("callBridge.calls");

  const [conferenceBridgeFlow, setConferenceBridgeFlow] = useState<string>(
    filters.conferenceBridgeFlow || "",
  );
  const [status, setStatus] = useState<string>(filters.status || "all");
  const [endCallStatus, setEndCallStatus] = useState<string>(
    filters.endCallStatus || "all",
  );

  const {
    data: bridges,
    isLoading: isLoadingBridges,
    isFetchingNextPage: isFetchingMoreBridges,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["call-bridge-flows-filter"],
    queryFn: ({ pageParam = 1 }) =>
      callBridgeService.fetchBridges({ page: pageParam, limit: 20 }),
    getNextPageParam: (lastPage, _pages, lastPageParam) => {
      if (lastPageParam < lastPage.totalPages) {
        return lastPageParam + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    gcTime: 0,
  });

  const bridgeFlowOptions = useMemo(() => {
    const allFlows = bridges?.pages.flatMap((page) => page.flows || []) || [];
    const uniqueFlows = new Map<string, { label: string; value: string }>();

    allFlows.forEach((flow) => {
      const value = flow.id || flow._id || "";
      if (!flow.name || !value || uniqueFlows.has(value)) return;
      uniqueFlows.set(value, {
        label: flow.name,
        value,
      });
    });

    return Array.from(uniqueFlows.values());
  }, [bridges?.pages]);

  const statusOptions = [
    { value: "pending", label: t("statuses.pending") },
    { value: "processing", label: t("statuses.processing") },
    { value: "in-progress", label: t("statuses.in_progress") },
    { value: "complete", label: t("statuses.complete") },
    { value: "deleted", label: t("statuses.deleted") },
  ];

  const endCallStatusOptions = [
    { value: "Completed", label: t("endCallStatuses.completed") },
    { value: "Deleted", label: t("endCallStatuses.deleted") },
    { value: "Call Failed", label: t("endCallStatuses.call_failed") },
  ];

  const menuPortalTarget =
    typeof document !== "undefined" ? document.body : undefined;

  return (
    <Collapsible>
      <div className="table-head">
        <div className="flex justify-between items-center gap-4 p-3">
          <h3>{t("title")}</h3>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <CollapsibleTrigger asChild>
                  <TooltipTrigger asChild>
                    <Toggle pressed={true} className="rounded-full">
                      <FilterAltIcon />
                    </Toggle>
                  </TooltipTrigger>
                </CollapsibleTrigger>
                <TooltipContent>
                  <p>{t("filters.toggle")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Link
              className={cn(buttonVariants())}
              href="/call-bridge/calls/create"
            >
              {t("create")}
            </Link>
          </div>
        </div>
      </div>

      <CollapsibleContent>
        <FilterBar
          onClear={() => {
            setConferenceBridgeFlow("");
            setStatus("all");
            setEndCallStatus("all");
            setFilters((prev) => ({
              ...prev,
              conferenceBridgeFlow: undefined,
              status: undefined,
              endCallStatus: undefined,
            }));
          }}
        >
          <FilterBox
            triggerLabel={t("filters.conferenceBridgeFlow.triggerLabel")}
            label={t("filters.conferenceBridgeFlow.label")}
            onReset={() => {
              setConferenceBridgeFlow("");
              setFilters((prev) => ({
                ...prev,
                conferenceBridgeFlow: undefined,
              }));
            }}
            onApply={() => {
              setFilters((prev) => ({
                ...prev,
                conferenceBridgeFlow: conferenceBridgeFlow || undefined,
              }));
              return true;
            }}
            numberOfFilters={conferenceBridgeFlow ? 1 : 0}
          >
            <VirtualizedSelect
              isLoading={isLoadingBridges || isFetchingMoreBridges}
              menuPortalTarget={menuPortalTarget}
              menuPosition="fixed"
              options={bridgeFlowOptions}
              placeholder={t("filters.conferenceBridgeFlow.placeholder")}
              value={
                bridgeFlowOptions.find(
                  (opt) => opt.value === conferenceBridgeFlow,
                ) || null
              }
              onChange={(option: { value: string | number } | null) =>
                setConferenceBridgeFlow(String(option?.value || ""))
              }
              onMenuScrollToBottom={() => {
                if (hasNextPage && !isFetchingMoreBridges) {
                  fetchNextPage();
                }
              }}
            />
          </FilterBox>

          <FilterBox
            triggerLabel={t("filters.status.triggerLabel")}
            label={t("filters.status.label")}
            onReset={() => {
              setStatus("all");
              setFilters((prev) => ({ ...prev, status: undefined }));
            }}
            onApply={() => {
              setFilters((prev) => ({
                ...prev,
                status: status === "all" ? undefined : status,
              }));
              return true;
            }}
            numberOfFilters={status !== "all" ? 1 : 0}
          >
            <RadioGroup value={status} onValueChange={setStatus}>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="all" id="call-bridge-status-all" />
                <Label htmlFor="call-bridge-status-all">
                  {t("filters.status.all")}
                </Label>
              </div>
              {statusOptions.map((option) => (
                <div className="flex items-center gap-2" key={option.value}>
                  <RadioGroupItem
                    value={option.value}
                    id={`call-bridge-status-${option.value}`}
                  />
                  <Label htmlFor={`call-bridge-status-${option.value}`}>
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </FilterBox>

          <FilterBox
            triggerLabel={t("filters.endCallStatus.triggerLabel")}
            label={t("filters.endCallStatus.label")}
            onReset={() => {
              setEndCallStatus("all");
              setFilters((prev) => ({ ...prev, endCallStatus: undefined }));
            }}
            onApply={() => {
              setFilters((prev) => ({
                ...prev,
                endCallStatus:
                  endCallStatus === "all" ? undefined : endCallStatus,
              }));
              return true;
            }}
            numberOfFilters={endCallStatus !== "all" ? 1 : 0}
          >
            <RadioGroup value={endCallStatus} onValueChange={setEndCallStatus}>
              <div className="flex items-center gap-2">
                <RadioGroupItem
                  value="all"
                  id="call-bridge-end-call-status-all"
                />
                <Label htmlFor="call-bridge-end-call-status-all">
                  {t("filters.endCallStatus.all")}
                </Label>
              </div>
              {endCallStatusOptions.map((option) => (
                <div className="flex items-center gap-2" key={option.value}>
                  <RadioGroupItem
                    value={option.value}
                    id={`call-bridge-end-call-status-${option.value}`}
                  />
                  <Label
                    htmlFor={`call-bridge-end-call-status-${option.value}`}
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </FilterBox>
        </FilterBar>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CallBridgeCallsHead;
