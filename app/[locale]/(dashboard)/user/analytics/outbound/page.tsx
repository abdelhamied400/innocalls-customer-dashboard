"use client";

import React from "react";
import { Clock, BarChart3, Timer, Users } from "lucide-react";
import {
  AccessTime,
  BarChart,
  CalendarMonth,
  Insights,
} from "@mui/icons-material";
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
import Select from "@/components/select";
import { Input } from "@/components/ui/input";
import useVocabStore from "@/store/vocab.slice";

type Option = {
  value: string;
  label: string;
};

export type OutboundAnalyticsFilters = {
  fromDate: Date;
  toDate: Date;
  agents: Option[];
};

const today = new Date();
const lastMonth = new Date();
lastMonth.setDate(today.getDate() - 30);

const outboundFilterConfig = {
  defaultValues: {
    fromDate: lastMonth,
    toDate: today,
    agents: [],
  } as OutboundAnalyticsFilters,
  schema: outboundFiltersSchema,
};

// --- Main Component ---
const OutboundAnalytics = () => {
  const { extensions } = useVocabStore();

  const { values, appliedValues, errors, setValue, reset, apply } =
    useFilterManager<OutboundAnalyticsFilters>(outboundFilterConfig);

  return (
    <div className="page" id="outbound-analytics">
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

        <SummaryStats filters={appliedValues} />

        <StatsDetailedCard
          title="Outbound Analytics"
          subtitle="View detailed analytics for outbound calls"
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
                Talk Time Distribution
              </TabsTrigger>
              <TabsTrigger
                value="hourly-distribution"
                className="flex items-center gap-1"
              >
                <Clock />
                Hourly Distribution
              </TabsTrigger>
              <TabsTrigger
                value="date-distribution"
                className="flex items-center gap-1"
              >
                <BarChart3 />
                Date Distribution
              </TabsTrigger>
              <TabsTrigger
                value="agent-stats"
                className="flex items-center gap-1"
              >
                <Users />
                Agent Stats
              </TabsTrigger>
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
            <TabsContent value="agent-stats">
              <AgentStatsAnalytics filters={appliedValues} />
            </TabsContent>
          </Tabs>
        </StatsDetailedCard>
      </div>
    </div>
  );
};

export default OutboundAnalytics;
