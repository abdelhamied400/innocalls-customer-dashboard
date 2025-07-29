"use client";

import React from "react";

import Field from "@/components/ui/field";
import DatePicker from "@/components/ui/date-picker";
import {
  AccessTime,
  BarChart,
  CalendarMonth,
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
import Select from "@/components/select";
import { Input } from "@/components/ui/input";
import useVocabStore from "@/store/vocab.slice";
import { Button } from "@/components/ui/button";
import { useFilterManager } from "@/hooks/useFilterManager";
import { userActivityFiltersSchema } from "@/validation/userActivityFilters";
import { useTranslations } from "next-intl";

type Option = {
  value: string;
  label: string;
};

export type UserActivityFilters = {
  fromDate: Date;
  toDate: Date;
  agents: Option[];
  sla: number;
};

const today = new Date();
const lastMonth = new Date();
lastMonth.setDate(today.getDate() - 30);

const UserActivityAnalytics = () => {
  const { extensions } = useVocabStore();

  const t = useTranslations("analytics.userActivity");
  const tCommon = useTranslations("analytics.common");

  const userActivityFilterConfig = {
    defaultValues: {
      fromDate: lastMonth,
      toDate: today,
      agents: [],
      sla: 10,
    } as UserActivityFilters,
    schema: userActivityFiltersSchema(t, tCommon),
  };

  const { values, appliedValues, errors, setValue, reset, apply } =
    useFilterManager<UserActivityFilters>(userActivityFilterConfig);

  return (
    <div className="page" id="user-activity-analytics">
      <div className="flex flex-col gap-2">
        <div className="filters">
          <StatsDetailedCard
            title={t('title')}
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
              <Field
                label={t("form.fields.sla.label")}
                postIcon={<AccessTime className="text-gray-400" />}
                error={errors.sla}
              >
                <Input
                  type="number"
                  variant="field"
                  className=""
                  placeholder={t("form.fields.sla.placeholder")}
                  value={values.sla}
                  onChange={(e) => setValue("sla", Number(e.target.value))}
                />
              </Field>
              <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                <Select
                  className="w-full"
                  placeholder={tCommon("form.fields.agents.placeholder")}
                  value={values.agents}
                  onChange={(value) => setValue("agents", value || [])}
                  options={extensions.map((ext) => ({
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
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={reset}>
                {tCommon("actions.resetFilter")}
              </Button>
              <Button onClick={apply}>{tCommon("actions.applyFilters")}</Button>
            </div>
          </StatsDetailedCard>
        </div>
        <QuickStats filters={appliedValues} />
        <StatsDetailedCard
          title={t("title")}
          subtitle={t("subtitle")}
          icon={<Insights />}
          value=""
          color="primary"
        >
          <Tabs defaultValue="call-distribution" className="w-full">
            <TabsList>
              <TabsTrigger
                value="call-distribution"
                className="flex items-center gap-1"
              >
                <BarChart />
                {t("tabs.callDistribution")}
              </TabsTrigger>
              <TabsTrigger
                value="call-stats"
                className="flex items-center gap-1"
              >
                <TrendingUpOutlined />
                {t("tabs.callStats")}
              </TabsTrigger>
              <TabsTrigger
                value="sla-compliance"
                className="flex items-center gap-1"
              >
                <AccessTime />
                {t("tabs.slaCompliance")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="call-distribution">
              <CallDistributionAnalytics filters={appliedValues} />
            </TabsContent>
            <TabsContent value="call-stats">
              <CallStats filters={appliedValues} />
            </TabsContent>
            <TabsContent value="sla-compliance">
              <SlaComplianceAnalytics filters={appliedValues} />
            </TabsContent>
          </Tabs>
        </StatsDetailedCard>
      </div>
    </div>
  );
};

export default UserActivityAnalytics;
