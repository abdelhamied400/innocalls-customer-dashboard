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

const userActivityFilterConfig = {
  defaultValues: {
    fromDate: lastMonth,
    toDate: today,
    agents: [],
    sla: 10,
  } as UserActivityFilters,
  schema: userActivityFiltersSchema,
};

const UserActivityAnalytics = () => {
  const { extensions } = useVocabStore();

  const { values, appliedValues, errors, setValue, reset, apply } =
    useFilterManager<UserActivityFilters>(userActivityFilterConfig);

  return (
    <div className="page" id="user-activity-analytics">
      <div className="flex flex-col gap-2">
        <div className="filters">
          <StatsDetailedCard
            title="Date Range Search"
            icon={<BarChart />}
            value=""
            color="primary"
          >
            <div className="py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Field
                label="From"
                postIcon={<CalendarMonth className="text-gray-400" />}
                error={errors.fromDate}
              >
                <DatePicker
                  className="min-w-36 flex-1"
                  placeholder="Enter from date"
                  value={values.fromDate}
                  onChange={(date) => setValue("fromDate", date || new Date())}
                />
              </Field>
              <Field
                label="To"
                postIcon={<CalendarMonth className="text-gray-400" />}
                error={errors.toDate}
              >
                <DatePicker
                  className="min-w-36 flex-1"
                  placeholder="Enter to date"
                  value={values.toDate}
                  onChange={(date) => setValue("toDate", date || new Date())}
                />
              </Field>
              <Field
                label="SLA"
                postIcon={<AccessTime className="text-gray-400" />}
                error={errors.sla}
              >
                <Input
                  type="number"
                  variant="field"
                  className=""
                  placeholder="Enter SLA compliance percentage"
                  value={values.sla}
                  onChange={(e) => setValue("sla", Number(e.target.value))}
                />
              </Field>
              <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                <Select
                  className="w-full"
                  placeholder="Select agents"
                  value={values.agents}
                  onChange={(value) => setValue("agents", value || [])}
                  options={extensions.map((ext) => ({
                    value: ext.ext,
                    label: `${ext.name} (${ext.ext})`,
                  }))}
                  isMulti
                  label="Select Agents"
                  showSelectedTags={false}
                  error={errors.agents}
                  isClearable
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={reset}>
                Clear Filters
              </Button>
              <Button onClick={apply}>Apply Filters</Button>
            </div>
          </StatsDetailedCard>
        </div>
        <QuickStats filters={appliedValues} />
        <StatsDetailedCard
          title="User Activity Analytics"
          subtitle="View detailed analytics for user activity"
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
                Call Distribution
              </TabsTrigger>
              <TabsTrigger
                value="call-stats"
                className="flex items-center gap-1"
              >
                <TrendingUpOutlined />
                Call Stats
              </TabsTrigger>
              <TabsTrigger
                value="sla-compliance"
                className="flex items-center gap-1"
              >
                <AccessTime />
                Sla Compliance
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
