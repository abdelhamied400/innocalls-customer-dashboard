"use client";

import React, { useEffect } from "react";

import Field from "@/components/ui/field";
import DatePicker from "@/components/ui/date-picker";
import {
  AccessTime,
  BarChart,
  CalendarMonth,
  Clear,
  Insights,
  TrendingUpOutlined,
} from "@mui/icons-material";
import StatsDetailedCard from "@/components/StatsDetailedCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import CallDistributionAnalytics from "./call-distribution";
import CallStats from "./call-stats";
import SlaComplianceAnalytics from "./sla-compliance";
import QuickStats from "./quick-stats";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFilterManager } from "@/hooks/useFilterManager";
import { userActivityFiltersSchema } from "@/validation/userActivityFilters";
import { useLocale, useTranslations } from "@/providers/TranslationProvider";
import useAppStore from "@/store/app.slice";
import { FilterBox } from "@/components/FilterBox";
import { formatDate } from "@/lib/date";
import AgentsPicker from "@/components/AgentsPicker";
import { Slider } from "@/components/ui/slider";
import hasTenant from "@/containers/hasTenant";
import withPermission from "@/containers/withPermission";

type Option = {
  value: string;
  label: string;
};

export type UserActivityFilters = {
  fromDate: Date;
  toDate: Date;
  agents: Option[];
  sla: number;
  includeInternalCalls?: boolean;
};

const today = new Date();
const lastMonth = new Date();
lastMonth.setDate(today.getDate() - 30);

const UserActivityAnalytics = () => {
  const t = useTranslations("analytics.userActivity");
  const tCommon = useTranslations("analytics.common");
  const tShared = useTranslations("common");
  const locale = useLocale();

  const userActivityFilterConfig = {
    defaultValues: {
      fromDate: lastMonth,
      toDate: today,
      agents: [],
      sla: 10,
    } as UserActivityFilters,
    schema: userActivityFiltersSchema(t, tCommon),
  };

  const { values, appliedValues, errors, setValue, reset, apply, applyValues } =
    useFilterManager<UserActivityFilters>(userActivityFilterConfig);

  return (
    <div className="page" id="user-activity-analytics">
      <div className="flex flex-col gap-2">
        <div className="filters p-2 border rounded-xl flex items-center justify-between flex-wrap gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <FilterBox
              triggerLabel={
                <p className="font-normal">
                  {tCommon("from")}{" "}
                  <b>{formatDate(values.fromDate, { locale: locale })}</b>{" "}
                  {tCommon("to")}{" "}
                  <b>{formatDate(values.toDate, { locale: locale })}</b>
                </p>
              }
              label={tCommon("form.fields.date.label")}
              onApply={apply}
              onReset={() => {
                applyValues({
                  fromDate: userActivityFilterConfig.defaultValues.fromDate,
                  toDate: userActivityFilterConfig.defaultValues.toDate,
                });
              }}
            >
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
            </FilterBox>
            <FilterBox
              triggerLabel={t("form.fields.sla.label")}
              label={t("form.fields.sla.label")}
              onApply={apply}
              onReset={() => {
                applyValues({
                  sla: userActivityFilterConfig.defaultValues.sla,
                });
              }}
            >
              <Slider
                defaultValue={[10]}
                max={200}
                step={1}
                value={[values.sla]}
                onValueChange={(value) => setValue("sla", value[0])}
              />
              <div className="flex items-center justify-between gap-1 text-sm">
                <p>{values.sla}</p>
                <p>200</p>
              </div>
              {errors.sla && (
                <p className="text-sm text-destructive-500">{errors.sla}</p>
              )}
            </FilterBox>

            <FilterBox
              triggerLabel={tCommon("form.fields.agents.label")}
              label={tCommon("form.fields.agents.label")}
              onApply={apply}
              onReset={() => {
                applyValues({
                  agents: userActivityFilterConfig.defaultValues.agents,
                });
              }}
            >
              <AgentsPicker
                selectedAgents={values.agents}
                onAgentsChange={(agents) => setValue("agents", agents)}
              />
            </FilterBox>
          </div>
          <Button onClick={reset} variant="ghost">
            <Clear />
            {tShared("actions.reset")}
          </Button>
        </div>
        <QuickStats filters={appliedValues} />

        <div className="border rounded-xl">
          <Tabs defaultValue="call-distribution" className="w-full">
            <TabsList className="p-3 border-b">
              <TabsTrigger
                value="call-distribution"
                className="flex items-center gap-1"
              >
                {t("tabs.callDistribution")}
              </TabsTrigger>
              <TabsTrigger
                value="sla-compliance"
                className="flex items-center gap-1"
              >
                {t("tabs.slaCompliance")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="call-distribution">
              <CallDistributionAnalytics filters={appliedValues} />
            </TabsContent>
            <TabsContent value="sla-compliance">
              <SlaComplianceAnalytics filters={appliedValues} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default hasTenant(
  withPermission(UserActivityAnalytics, "agentsAccessControl")
);
