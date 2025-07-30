"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";
import { PieChart, CalendarIcon } from "lucide-react";
import DatePicker from "@/components/ui/date-picker";
import Field from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import {
  Insights,
  BarChart as BarChartIcon,
  Group,
  Call,
  PeopleAlt,
  BarChart,
  Search,
  Queue,
} from "@mui/icons-material";
import { useFilterManager } from "@/hooks/useFilterManager";
import { inboundFiltersSchema } from "@/validation/inboundFilters";
import StatsDetailedCard from "@/components/StatsDetailedCard";
import InboundAnalyticsOverview from "./overview";
import InboundAnalyticsDistribution from "./distribution";
import InboundAnalyticsAgentPerformance from "./agent-performance";
import InboundAnalyticsIVRAnalysis from "./ivr-analysis";
import InboundAnalyticsRepeatedCallers from "./repeated-callers";
import QuickStats from "./quick-stats";
import Select from "@/components/select";
import useVocabStore from "@/store/vocab.slice";
import InboundAnalyticsDateDistribution from "./date-distribution";
import InboundAnalyticsQueueAnalysis from "./queue-analysis";
import { useTranslations } from "next-intl";
import useAppStore from "@/store/app.slice";
import { useSession } from "next-auth/react";

export type InboundAnalyticsFilterBy = "all" | "team";

type Option<T> = {
  value: T;
  label: string;
};

export type InboundAnalyticsFilters = {
  fromDate: Date;
  toDate: Date;
  agents?: string[];
  queue?: string;
  filterBy: InboundAnalyticsFilterBy;
};

const InboundAnalytics = () => {
  const { extensions, ergs } = useVocabStore();
  const { setPageTitle } = useAppStore();
  const { data: session } = useSession();

  const [currentTab, setCurrentTab] = useState<string>("overview");

  const t = useTranslations("analytics.inbound");
  const tCommon = useTranslations("analytics.common");

  useEffect(() => {
    setPageTitle(t("title"));

    // Cleanup when component unmounts
    return () => setPageTitle(null);
  }, [setPageTitle, t]);

  const filterByOptions = [
    { value: "all", label: t("filters.filterBy.options.all") },
    { value: "team", label: t("filters.filterBy.options.team") },
  ];

  const today = new Date();
  const lastMonth = new Date();
  lastMonth.setDate(today.getDate() - 30);

  const inboundFilterConfig = {
    defaultValues: {
      fromDate: lastMonth,
      toDate: today,
      agents: [],
      queue: undefined,
      filterBy: "all" as InboundAnalyticsFilterBy,
    } as InboundAnalyticsFilters,
    schema: inboundFiltersSchema(t, tCommon),
  };

  const { values, appliedValues, errors, setValue, reset, apply } =
    useFilterManager<InboundAnalyticsFilters>(inboundFilterConfig);

  return (
    <div className="page" id="inbound-analytics">
      <div className="flex flex-col gap-2">
        <div className="filters">
          <StatsDetailedCard
            title={t("title")}
            icon={<BarChart />}
            value=""
            color="primary"
          >
            <div className="py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Field
                label={tCommon("form.fields.fromDate.label")}
                postIcon={<CalendarIcon className="text-gray-400" />}
                error={errors.fromDate}
              >
                <DatePicker
                  className="min-w-36 flex-1"
                  placeholder={tCommon("form.fields.fromDate.placeholder")}
                  value={values.fromDate}
                  onChange={(date) => setValue("fromDate", date || new Date())}
                />
              </Field>
              <Field
                label={tCommon("form.fields.toDate.label")}
                postIcon={<CalendarIcon className="text-gray-400" />}
                error={errors.toDate}
              >
                <DatePicker
                  className="min-w-36 flex-1"
                  placeholder={tCommon("form.fields.toDate.placeholder")}
                  value={values.toDate}
                  onChange={(date) => setValue("toDate", date || new Date())}
                />
              </Field>
              {/* filter by */}
              <Select
                className="w-full"
                placeholder={t("filters.filterBy.placeholder")}
                value={filterByOptions.find(
                  (option) => option.value === values.filterBy
                )}
                onChange={(option) => {
                  setValue("filterBy", option?.value || "all");
                }}
                options={filterByOptions}
                label={t("filters.filterBy.label")}
                showSelectedTags={false}
                error={errors.filterBy}
              />
              {/* queue */}
              {values.filterBy === "team" && (
                <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                  <Select
                    className="w-full"
                    placeholder={t("filters.team.placeholder")}
                    value={ergs
                      ?.map((erg) => ({
                        value: erg.name,
                        label: erg.name,
                      }))
                      .find((erg) => erg.value === values.queue)}
                    onChange={(option) => {
                      setValue("queue", option?.value);
                    }}
                    options={
                      ergs?.map((erg) => ({
                        value: erg.name,
                        label: erg.name,
                      })) || []
                    }
                    label={t("filters.team.label")}
                    showSelectedTags={false}
                    error={errors.queue}
                  />
                </div>
              )}

              {/* agents */}
              {values.filterBy === "all" && (
                <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                  <Select
                    className="w-full"
                    placeholder={tCommon("form.fields.agents.placeholder")}
                    value={extensions
                      .map((ext) => ({
                        value: ext.ext,
                        label: `${ext.name} (${ext.ext})`,
                      }))
                      .filter((agent) => values.agents?.includes(agent.value))}
                    onChange={(agents) =>
                      setValue(
                        "agents",
                        agents.map((a: any) => a.value)
                      )
                    }
                    options={extensions.map((ext) => ({
                      value: ext.ext,
                      label: `${ext.name} (${ext.ext})`,
                    }))}
                    isMulti
                    label={tCommon("form.fields.agents.label")}
                    showSelectedTags={false}
                    error={errors.agents[0]}
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={reset}>
                {tCommon("actions.resetFilter")}
              </Button>
              <Button
                onClick={() => {
                  // resets to overview tab if filterBy changes
                  if (values.filterBy !== appliedValues.filterBy) {
                    setCurrentTab("overview");
                  }
                  apply();
                }}
              >
                <Search />
                {tCommon("actions.applyFilters")}
              </Button>
            </div>
          </StatsDetailedCard>
        </div>

        <QuickStats filters={appliedValues} />

        <StatsDetailedCard
          title={t("detailedStats.title")}
          subtitle={t("detailedStats.subtitle")}
          icon={<Insights />}
          value=""
          color="primary"
        >
          <Tabs
            className="w-full"
            value={currentTab}
            onValueChange={setCurrentTab}
          >
            <TabsList>
              <TabsTrigger value="overview" className="flex items-center gap-1">
                <BarChartIcon />
                {t("tabs.summary")}
              </TabsTrigger>
              <TabsTrigger
                value="distribution"
                className="flex items-center gap-1"
              >
                <PieChart />
                {t("tabs.callDistribution")}
              </TabsTrigger>
              {appliedValues.filterBy === "team" && (
                <TabsTrigger value="agents" className="flex items-center gap-1">
                  <PeopleAlt />
                  {t("tabs.teamPerformance")}
                </TabsTrigger>
              )}
              {appliedValues.filterBy === "all" &&
                session?.user.role === "Admin" && (
                  <TabsTrigger value="ivr" className="flex items-center gap-1">
                    <Call />
                    {t("tabs.ivrInsights")}
                  </TabsTrigger>
                )}
              {appliedValues.filterBy === "team" && (
                <TabsTrigger
                  value="repeated"
                  className="flex items-center gap-1"
                >
                  <Group />
                  {t("tabs.frequentCallers")}
                </TabsTrigger>
              )}
              <TabsTrigger
                value="date-distribution"
                className="flex items-center gap-1"
              >
                <CalendarIcon />
                {t("tabs.dateDistribution")}
              </TabsTrigger>
              {appliedValues.filterBy === "team" && (
                <TabsTrigger value="queue" className="flex items-center gap-1">
                  <Queue />
                  {t("tabs.queueAnalysis")}
                </TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="overview">
              <InboundAnalyticsOverview filters={appliedValues} />
            </TabsContent>
            <TabsContent value="distribution">
              <InboundAnalyticsDistribution filters={appliedValues} />
            </TabsContent>
            <TabsContent value="ivr">
              <InboundAnalyticsIVRAnalysis filters={appliedValues} />
            </TabsContent>
            <TabsContent value="date-distribution">
              <InboundAnalyticsDateDistribution filters={appliedValues} />
            </TabsContent>
            <TabsContent value="agents">
              <InboundAnalyticsAgentPerformance filters={appliedValues} />
            </TabsContent>
            <TabsContent value="repeated">
              <InboundAnalyticsRepeatedCallers filters={appliedValues} />
            </TabsContent>
            <TabsContent value="queue">
              <InboundAnalyticsQueueAnalysis filters={appliedValues} />
            </TabsContent>
          </Tabs>
        </StatsDetailedCard>
      </div>
    </div>
  );
};

export default InboundAnalytics;
