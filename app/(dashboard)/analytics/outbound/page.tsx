"use client";

import React, { useEffect } from "react";
import { Clock, BarChart3, Timer, Users } from "lucide-react";
import { BarChart, CalendarMonth, Insights } from "@mui/icons-material";
import StatsDetailedCard from "@/components/StatsDetailedCard";
import Field from "@/components/ui/field";
import DatePicker from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { useFilterManager } from "@/hooks/useFilterManager";
import { outboundFiltersSchema } from "@/validation/outboundFilters";
import SummaryStats from "./summary-stats";
import TalkTimeDistribution from "./talk-time-distribution";
import HourlyDistributionAnalytics from "./hourly-distribution";
import DateDistributionAnalytics from "./date-distribution";
import AgentStatsAnalytics from "./agent-stats";
import Select from "@/components/oldselect";
import { useLocale, useTranslations } from "@/providers/TranslationProvider";
import useAppStore from "@/store/app.slice";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useVocab } from "@/hooks/useVocab";
import useAuth from "@/hooks/useAuth";
import withActiveOrganization from "@/containers/withActiveOrganization";

type Option = {
  value: string;
  label: string;
};

export type OutboundAnalyticsFilters = {
  fromDate: Date;
  toDate: Date;
  agents: Option[];
  includeInternalCalls: boolean;
};

const today = new Date();
const lastMonth = new Date();
lastMonth.setDate(today.getDate() - 30);

// --- Main Component ---
const OutboundAnalytics = () => {
  const { extensions } = useVocab();
  const { setPageTitle } = useAppStore();
  const { data: auth } = useAuth();

  const tCommon = useTranslations("analytics.common");
  const t = useTranslations("analytics.outbound");
  const locale = useLocale();

  const outboundFilterConfig = {
    defaultValues: {
      fromDate: lastMonth,
      toDate: today,
      agents: [],
      includeInternalCalls: false,
    } as OutboundAnalyticsFilters,
    schema: outboundFiltersSchema(tCommon),
  };

  const { values, appliedValues, errors, setValue, reset, apply } =
    useFilterManager<OutboundAnalyticsFilters>(outboundFilterConfig);

  return (
    <div className="page" id="outbound-analytics">
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
                postIcon={<CalendarMonth className="text-gray-400" />}
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
                postIcon={<CalendarMonth className="text-gray-400" />}
                error={errors.toDate}
              >
                <DatePicker
                  className="min-w-36 flex-1"
                  placeholder={tCommon("form.fields.toDate.placeholder")}
                  value={values.toDate}
                  onChange={(date) => setValue("toDate", date || new Date())}
                />
              </Field>
              <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                <Select
                  className="w-full"
                  placeholder={tCommon("form.fields.agents.placeholder")}
                  value={values.agents}
                  onChange={(value) => setValue("agents", value || [])}
                  options={extensions?.map((ext) => ({
                    value: ext.ext,
                    label: `${ext.name} (${ext.ext})`,
                  }))}
                  isMulti
                  label={tCommon("form.fields.agents.label")}
                  showSelectedTags={false}
                  error={errors.agents}
                  isClearable
                />
              </div>
              {/* add a switch only if the filterBy is "team" */}
              <div className="flex items-center space-x-2">
                <Switch
                  checked={values.includeInternalCalls}
                  onCheckedChange={(checked) =>
                    setValue("includeInternalCalls", checked)
                  }
                />
                <Label htmlFor="includeInternalCalls">
                  {t("filters.includeInternalCalls.label")}
                </Label>
              </div>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <Button variant="outline" onClick={reset}>
                {tCommon("actions.resetFilter")}
              </Button>
              <Button onClick={apply}>{tCommon("actions.applyFilters")}</Button>
            </div>
          </StatsDetailedCard>
        </div>

        <SummaryStats filters={appliedValues} />

        <StatsDetailedCard
          title={t("title")}
          subtitle={t("subtitle")}
          icon={<Insights />}
          value=""
          color="primary"
        >
          <Tabs defaultValue="talk-time-distribution" className="w-full">
            <TabsList>
              <TabsTrigger
                value="talk-time-distribution"
                className="flex items-center gap-1"
              >
                <Timer />
                {t("tabs.talkTimeDistribution")}
              </TabsTrigger>
              <TabsTrigger
                value="hourly-distribution"
                className="flex items-center gap-1"
              >
                <Clock />
                {t("tabs.hourlyDistribution")}
              </TabsTrigger>
              <TabsTrigger
                value="date-distribution"
                className="flex items-center gap-1"
              >
                <BarChart3 />
                {t("tabs.dateDistribution")}
              </TabsTrigger>
              {auth?.user?.agentsAccessControl && (
                <TabsTrigger
                  value="agent-stats"
                  className="flex items-center gap-1"
                >
                  <Users />
                  {t("tabs.agentStats")}
                </TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="talk-time-distribution">
              <TalkTimeDistribution filters={appliedValues} />
            </TabsContent>
            <TabsContent value="hourly-distribution">
              <HourlyDistributionAnalytics filters={appliedValues} />
            </TabsContent>
            <TabsContent value="date-distribution">
              <DateDistributionAnalytics filters={appliedValues} />
            </TabsContent>
            {auth?.user?.agentsAccessControl && (
              <TabsContent value="agent-stats">
                <AgentStatsAnalytics filters={appliedValues} />
              </TabsContent>
            )}
          </Tabs>
        </StatsDetailedCard>
      </div>
    </div>
  );
};

export default withActiveOrganization(OutboundAnalytics);
