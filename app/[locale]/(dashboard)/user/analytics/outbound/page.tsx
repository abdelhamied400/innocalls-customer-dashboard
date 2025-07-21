"use client";

import React, { useState } from "react";
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
  slaCompliance: number;
};

// --- Main Component ---
const OutboundAnalytics = () => {
  const { extensions } = useVocabStore();
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [agents, setAgents] = useState<Option[]>([]);
  const [slaCompliance, setSlaCompliance] = useState<number>(10);

  const [filters, setFilters] = useState<OutboundAnalyticsFilters>({
    fromDate,
    toDate,
    agents,
    slaCompliance,
  });

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
              >
                <DatePicker
                  className="min-w-36 flex-1"
                  placeholder="Enter from date"
                  value={fromDate}
                  onChange={(date) => setFromDate(date || new Date())}
                />
              </Field>
              <Field
                label="To"
                postIcon={<CalendarMonth className="text-gray-400" />}
              >
                <DatePicker
                  className="min-w-36 flex-1"
                  placeholder="Enter to date"
                  value={toDate}
                  onChange={(date) => setToDate(date || new Date())}
                />
              </Field>
              <Field
                label="SLA Compliance"
                postIcon={<AccessTime className="text-gray-400" />}
              >
                <Input
                  type="number"
                  variant="field"
                  className=""
                  placeholder="Enter SLA compliance percentage"
                  value={slaCompliance}
                  onChange={(e) => setSlaCompliance(Number(e.target.value))}
                />
              </Field>
              <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                <Select
                  className="w-full"
                  placeholder="Select agents"
                  value={agents}
                  onChange={(value) => setAgents(value || [])}
                  options={extensions.map((ext) => ({
                    value: ext.ext,
                    label: ext.name,
                  }))}
                  isMulti
                  label="Select Agents"
                  showSelectedTags={false}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() =>
                  setFilters({
                    fromDate,
                    toDate,
                    agents,
                    slaCompliance,
                  })
                }
              >
                Apply Filters
              </Button>
            </div>
          </StatsDetailedCard>
        </div>

        <SummaryStats filters={filters} />

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
              <TalkTimeDistribution filters={filters} />
            </TabsContent>
            <TabsContent value="hourly-distribution">
              <HourlyDistributionAnalytics filters={filters} />
            </TabsContent>
            <TabsContent value="date-distribution">
              <DateDistributionAnalytics filters={filters} />
            </TabsContent>
            <TabsContent value="agent-stats">
              <AgentStatsAnalytics filters={filters} />
            </TabsContent>
          </Tabs>
        </StatsDetailedCard>
      </div>
    </div>
  );
};

export default OutboundAnalytics;
