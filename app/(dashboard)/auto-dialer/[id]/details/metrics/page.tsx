"use client";
import withPermission from "@/containers/withPermission";
import { useMemo, useState } from "react";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import useLayoutManager from "@/hooks/use-layout-manager";
import { useTranslations } from "@/providers/TranslationProvider";
import autoDialerService from "@/services/auto-dialer.service";
import { CampaignMetrics } from "@/types/autoDialerCampaign";
import { useParams } from "next/navigation";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataTableProvider, {
  DataTable,
  DataTableBody,
  DataTableHeader,
  DataTableSkeleton,
} from "@/components/ui/data-table";
import DataTablePagination from "@/components/ui/data-table-pagination";
import Field from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useSip } from "@/providers/webrtc/SipProvider";
import {
  Download,
  FilterAltOutlined,
  InsightsOutlined,
  Search,
} from "@mui/icons-material";
import { toast } from "sonner";
import {
  waitingCallsColumns,
  inProgressCallsColumns,
  agentDetailsColumns,
  initiatedCallsColumns,
  AGENT_STATUSES,
  agentStatusDotColors,
} from "./columns";
import StatsMiniCard from "@/components/StatsMiniCard";
import useAppStore from "@/store/app.slice";
import useWebrtcStore from "@/store/webrtc.slice";
import Image from "next/image";
import { FilterBox } from "@/components/FilterBox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Toggle } from "@/components/ui/toggle";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { exportToCsv } from "@/lib/exportToCsv";

const AGENT_COLORS = {
  online: "#0E4D80",
  available: "#23C998",
  onCall: "#FF4757",
  dialing: "#FFD061",
  onBreak: "#DB26CE",
};

const EMPTY_CHART_COLOR = "#D1D5DB";

const AutoDialerCampaignMetrics = () => {
  const t = useTranslations("autoDialer.campaignDetails");
  const searchT = useTranslations("common.search");
  const { id } = useParams<{ id: string }>();
  const { extensionState, spy } = useSip();
  const { setWebrtcOpen } = useAppStore();
  const { extension } = useWebrtcStore();
  const {
    hasExpandedSidebar,
    hasExpandedWebrtc,
    screenWidth,
    isSmall,
    isMedium,
    isLarge,
  } = useLayoutManager();

  const { data: campaign, isLoading: isCampaignLoading } = useLocalizedQuery({
    queryKey: ["auto-dialer-campaign", id],
    queryFn: () => autoDialerService.getCampaign(id as string),
    refetchInterval: 15000,
  });

  const isActiveCampaign = campaign?.status === "active";

  const {
    data,
    isLoading,
    refetch: refetchMetrics,
  } = useLocalizedQuery({
    queryKey: ["auto-dialer-campaign-metrics", id],
    queryFn: () => autoDialerService.fetchCampaignMetrics(id),
    enabled: isActiveCampaign,
    refetchInterval: isActiveCampaign ? 15000 : false,
  });

  const {
    data: initiatedCalls,
    isLoading: isInitiatedCallsLoading,
    refetch: refetchInitiatedCalls,
  } = useLocalizedQuery({
    queryKey: ["auto-dialer-campaign-initiated-calls", id],
    queryFn: () => autoDialerService.fetchCurrentInitiatedCalls(id),
    enabled: isActiveCampaign,
    refetchInterval: isActiveCampaign ? 15000 : false,
    refetchOnMount: isActiveCampaign, // only refetch on mount if campaign is active
  });

  const metrics = data as CampaignMetrics | undefined;
  const [waitingCallsSearch, setWaitingCallsSearch] = useState("");
  const [inProgressSearch, setInProgressSearch] = useState("");
  const [agentDetailsSearch, setAgentDetailsSearch] = useState("");
  const [initiatedCallsSearch, setInitiatedCallsSearch] = useState("");
  const [agentStatusFilter, setAgentStatusFilter] = useState("");
  const [agentStatusDraft, setAgentStatusDraft] = useState("");

  const agentChartData = metrics
    ? [
        {
          name: t("metrics.onlineAgents"),
          count: metrics.onlineAgents,
          color: AGENT_COLORS.online,
        },
        {
          name: t("metrics.availableAgents"),
          count: metrics.availableAgents,
          color: AGENT_COLORS.available,
        },
        {
          name: t("metrics.onCallAgents"),
          count: metrics.onCallAgents,
          color: AGENT_COLORS.onCall,
        },
        {
          name: t("metrics.dialingAgents"),
          count: metrics.dialingAgents,
          color: AGENT_COLORS.dialing,
        },
        {
          name: t("metrics.onBreakAgents"),
          count: metrics.onBreakAgents,
          color: AGENT_COLORS.onBreak,
        },
      ]
    : [];

  const totalAgents = metrics?.totalAgents ?? 0;

  const hasAgentChartData = agentChartData.some((entry) => entry.count > 0);
  const pieChartData = hasAgentChartData
    ? agentChartData
    : [{ name: "empty", count: 1, color: EMPTY_CHART_COLOR }];

  const isLaptopScreen = screenWidth >= 1024 && screenWidth < 1536;
  const isSmallerScreen = isSmall || isMedium || isLarge;
  const shouldShowLegendBelow =
    isSmallerScreen ||
    (isLaptopScreen && (hasExpandedSidebar || hasExpandedWebrtc));

  const filteredWaitingCalls = useMemo(() => {
    const rows = metrics?.waitingCalls ?? [];
    const keyword = waitingCallsSearch.trim().toLowerCase();

    if (!keyword) return rows;

    return rows.filter((row) => {
      const searchable = [
        row.callerInfo?.callerNumber,
        row.callerInfo?.callerName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return searchable.includes(keyword);
    });
  }, [metrics?.waitingCalls, waitingCallsSearch]);

  const filteredInProgressCalls = useMemo(() => {
    const rows = metrics?.inProgressCalls ?? [];
    const keyword = inProgressSearch.trim().toLowerCase();

    if (!keyword) return rows;

    return rows.filter((row) => {
      const searchable = [
        row.agentId,
        row.callerInfo?.callerNumber,
        row.callerInfo?.callerName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(keyword);
    });
  }, [metrics?.inProgressCalls, inProgressSearch]);

  const filteredAgentDetails = useMemo(() => {
    const rows = metrics?.agentDetails ?? [];
    const keyword = agentDetailsSearch.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesStatus = agentStatusFilter
        ? row.status === agentStatusFilter
        : true;

      if (!matchesStatus) return false;
      if (!keyword) return true;

      const searchable = [row.name, row.agentId]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(keyword);
    });
  }, [metrics?.agentDetails, agentDetailsSearch, agentStatusFilter]);

  const filteredInitiatedCalls = useMemo(() => {
    const rows = initiatedCalls ?? [];
    const keyword = initiatedCallsSearch.trim().toLowerCase();

    if (!keyword) return rows;

    return rows.filter((row) => {
      const searchable = [row.phone, row.name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return searchable.includes(keyword);
    });
  }, [initiatedCalls, initiatedCallsSearch]);

  const onSpy = (ext: string) => {
    setWebrtcOpen(true);
    if (extensionState !== "connected") {
      toast.error("Error", {
        description: t("metrics.spyConnectionError"),
      });
      return;
    }
    spy(ext);
  };

  if (isCampaignLoading) {
    return (
      <div className="rounded-lg bg-white p-6 text-gray-500 shadow">
        <p className="text-sm">{t("loading")}</p>
      </div>
    );
  }

  if (!isActiveCampaign) {
    return (
      <div className="rounded-lg bg-white p-8 shadow">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-3 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
            <InsightsOutlined />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            {t("metrics.title")}
          </h3>
          <p className="text-sm text-gray-500">
            {t("metrics.onlyAvailableForActiveCampaigns")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <div
          className={`flex gap-3 bg-white shadow rounded-lg p-4 ${
            shouldShowLegendBelow ? "flex-col" : "items-center"
          }`}
        >
          <div
            className={
              shouldShowLegendBelow ? "w-full flex justify-center" : ""
            }
          >
            <ResponsiveContainer width={250} height={250}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={80}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  <tspan
                    x="50%"
                    dy="-0.6em"
                    className="fill-muted-foreground text-sm"
                  >
                    {t("metrics.total")}
                  </tspan>
                  <tspan
                    x="50%"
                    dy="1.4em"
                    className="fill-foreground text-lg font-semibold"
                  >
                    {totalAgents} {t("metrics.agents")}
                  </tspan>
                </text>
                {hasAgentChartData && <RechartsTooltip />}
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div
            className={`flex flex-col gap-x-4 gap-y-2 px-2 ${
              shouldShowLegendBelow ? "w-full" : "flex-1"
            }`}
          >
            {agentChartData.map((entry) => (
              <div
                key={entry.name}
                className="flex items-center gap-2 text-sm "
              >
                <span
                  className="h-4 w-4 rounded-sm"
                  style={{ backgroundColor: entry.color }}
                />
                <div className="flex flex-1">
                  <span className="flex-1 text-muted-foreground text-lg">
                    {entry.name}
                  </span>
                  <span className="text-bold text-lg">{entry.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 1: Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-4">
          <StatsMiniCard
            icon={
              <Image
                src="/assets/icons/stats/queue.svg"
                alt="Calls Waiting"
                width={24}
                height={24}
              />
            }
            label={t("metrics.callsWaiting")}
            value={metrics?.callsWaiting ?? 0}
            color="warning"
          />
          <StatsMiniCard
            icon={
              <Image
                src="/assets/icons/stats/call.svg"
                alt="Calls In Progress"
                width={24}
                height={24}
              />
            }
            label={t("metrics.callsInProgress")}
            value={metrics?.callsInProgress ?? 0}
            color="success"
          />
          <StatsMiniCard
            icon={
              <Image
                src="/assets/icons/stats/phone_callback.svg"
                alt="Oldest Call Wait Time"
                width={24}
                height={24}
              />
            }
            label={t("metrics.oldestCallWaitTime")}
            value={`${Math.round((metrics?.oldestCallWaitTime ?? 0) / 1000)} ${t("metrics.seconds")}`}
            color="primary"
          />
          <StatsMiniCard
            icon={
              <Image
                src="/assets/icons/stats/call-1.svg"
                alt="Average Current Wait Time"
                width={24}
                height={24}
              />
            }
            label={t("metrics.averageCurrentWaitTime")}
            value={`${Math.round((metrics?.averageCurrentWaitTime ?? 0) / 1000)} ${t("metrics.seconds")}`}
            color="default"
          />
        </div>
      </div>

      {/* Section 3: Tabbed Tables */}
      <Tabs
        defaultValue="waitingCalls"
        onValueChange={(value) => {
          if (value === "initiatedCalls") {
            refetchInitiatedCalls();
          }
          refetchMetrics();
        }}
      >
        <TabsList>
          <TabsTrigger value="waitingCalls">
            {t("metrics.tabs.waitingCalls")}
          </TabsTrigger>
          <TabsTrigger value="inProgressCalls">
            {t("metrics.tabs.inProgressCalls")}
          </TabsTrigger>
          <TabsTrigger value="agentDetails">
            {t("metrics.tabs.agentDetails")}
          </TabsTrigger>
          <TabsTrigger value="initiatedCalls">
            {t("metrics.tabs.initiatedCalls")}
          </TabsTrigger>
        </TabsList>

        <div className="border rounded-xl mt-4">
          <TabsContent value="waitingCalls">
            <div className="table-head">
              <div className="flex justify-between items-center gap-4 p-3">
                <h3>{t("metrics.tabs.waitingCalls")}</h3>
                <div className="flex items-center gap-4 actions">
                  <Field preIcon={<Search className="text-muted-foreground" />}>
                    <Input
                      variant="field"
                      placeholder={searchT("placeholder")}
                      type="search"
                      value={waitingCallsSearch}
                      onChange={(e) => setWaitingCallsSearch(e.target.value)}
                    />
                  </Field>
                </div>
              </div>
            </div>
            <DataTableProvider
              data={filteredWaitingCalls}
              columns={waitingCallsColumns(t)}
              isLoading={isLoading}
              noResultsMessage={t("metrics.noData")}
              pagination={{ totalItems: filteredWaitingCalls.length }}
            >
              <DataTable>
                <DataTableHeader />
                {isLoading ? <DataTableSkeleton /> : <DataTableBody />}
              </DataTable>
              <DataTablePagination />
            </DataTableProvider>
          </TabsContent>

          <TabsContent value="inProgressCalls">
            <div className="table-head">
              <div className="flex justify-between items-center gap-4 p-3">
                <h3>{t("metrics.tabs.inProgressCalls")}</h3>
                <div className="flex items-center gap-4 actions">
                  <Field preIcon={<Search className="text-muted-foreground" />}>
                    <Input
                      variant="field"
                      placeholder={searchT("placeholder")}
                      type="search"
                      value={inProgressSearch}
                      onChange={(e) => setInProgressSearch(e.target.value)}
                    />
                  </Field>
                </div>
              </div>
            </div>
            <DataTableProvider
              data={filteredInProgressCalls}
              columns={inProgressCallsColumns(t)}
              isLoading={isLoading}
              noResultsMessage={t("metrics.noData")}
              meta={{ onSpy, currentExtension: extension?.ext }}
              pagination={{ totalItems: filteredInProgressCalls.length }}
            >
              <DataTable>
                <DataTableHeader />
                {isLoading ? <DataTableSkeleton /> : <DataTableBody />}
              </DataTable>
              <DataTablePagination />
            </DataTableProvider>
          </TabsContent>

          <TabsContent value="agentDetails">
            <Collapsible>
              <div className="table-head">
                <div className="flex justify-between items-center gap-4 p-3">
                  <h3>{t("metrics.tabs.agentDetails")}</h3>
                  <div className="flex items-center gap-4 actions">
                    <Field
                      preIcon={<Search className="text-muted-foreground" />}
                    >
                      <Input
                        variant="field"
                        placeholder={searchT("placeholder")}
                        type="search"
                        value={agentDetailsSearch}
                        onChange={(e) => setAgentDetailsSearch(e.target.value)}
                      />
                    </Field>
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
                          <p>{t("metrics.tooltips.toggleFilters")}</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              exportToCsv(
                                filteredAgentDetails,
                                [
                                  {
                                    key: "name",
                                    header: t("metrics.columns.agentName"),
                                  },
                                  {
                                    key: "agentId",
                                    header: t("metrics.columns.agentId"),
                                  },
                                  {
                                    key: "status",
                                    header: t("metrics.columns.status"),
                                  },
                                ],
                                "agent-details",
                              );
                            }}
                          >
                            <Download />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t("metrics.tooltips.export")}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <CollapsibleContent>
                  <div className="flex flex-wrap items-center gap-2 p-3 pt-0">
                    <FilterBox
                      triggerLabel={t("metrics.columns.status")}
                      label={t("metrics.columns.status")}
                      numberOfFilters={agentStatusFilter ? 1 : 0}
                      onReset={() => {
                        setAgentStatusDraft("");
                        setAgentStatusFilter("");
                      }}
                      onApply={() => {
                        setAgentStatusFilter(agentStatusDraft);
                        return true;
                      }}
                    >
                      <RadioGroup
                        value={agentStatusDraft || "__all"}
                        onValueChange={(value) => {
                          setAgentStatusDraft(value === "__all" ? "" : value);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="__all" id="agent-status-all" />
                          <Label htmlFor="agent-status-all">
                            {t("metrics.filters.all")}
                          </Label>
                        </div>
                        {AGENT_STATUSES.map((status) => (
                          <div className="flex items-center gap-2" key={status}>
                            <RadioGroupItem
                              value={status}
                              id={`agent-status-${status}`}
                            />
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${agentStatusDotColors[status]}`}
                            />
                            <Label htmlFor={`agent-status-${status}`}>
                              {t(`metrics.columns.agentStatuses.${status}`)}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FilterBox>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
            <DataTableProvider
              data={filteredAgentDetails}
              columns={agentDetailsColumns(t)}
              isLoading={isLoading}
              noResultsMessage={t("metrics.noData")}
              pagination={{ totalItems: filteredAgentDetails.length }}
            >
              <DataTable>
                <DataTableHeader />
                {isLoading ? <DataTableSkeleton /> : <DataTableBody />}
              </DataTable>
              <DataTablePagination />
            </DataTableProvider>
          </TabsContent>

          <TabsContent value="initiatedCalls">
            <div className="table-head">
              <div className="flex justify-between items-center gap-4 p-3">
                <h3>{t("metrics.tabs.initiatedCalls")}</h3>
                <div className="flex items-center gap-4 actions">
                  <Field preIcon={<Search className="text-muted-foreground" />}>
                    <Input
                      variant="field"
                      placeholder={searchT("placeholder")}
                      type="search"
                      value={initiatedCallsSearch}
                      onChange={(e) => setInitiatedCallsSearch(e.target.value)}
                    />
                  </Field>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            exportToCsv(
                              filteredInitiatedCalls,
                              [
                                {
                                  key: "phone",
                                  header: t("metrics.columns.phone"),
                                },
                                {
                                  key: "name",
                                  header: t("metrics.columns.customerName"),
                                },
                                {
                                  key: "currentTrial",
                                  header: t("metrics.columns.currentTrial"),
                                },
                              ],
                              "initiated-calls",
                            );
                          }}
                        >
                          <Download />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t("metrics.tooltips.export")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
            <DataTableProvider
              data={filteredInitiatedCalls}
              columns={initiatedCallsColumns(t)}
              isLoading={isInitiatedCallsLoading}
              noResultsMessage={t("metrics.noData")}
              pagination={{ totalItems: filteredInitiatedCalls.length }}
            >
              <DataTable>
                <DataTableHeader />
                {isInitiatedCallsLoading ? (
                  <DataTableSkeleton />
                ) : (
                  <DataTableBody />
                )}
              </DataTable>
              <DataTablePagination />
            </DataTableProvider>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default withPermission(
  AutoDialerCampaignMetrics,
  "fullAccessAutoDialerCampaigns",
);
