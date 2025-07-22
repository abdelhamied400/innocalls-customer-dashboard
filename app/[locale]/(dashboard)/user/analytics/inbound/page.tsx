"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
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
} from "@mui/icons-material";
import StatsDetailedCard from "@/components/StatsDetailedCard";
import InboundAnalyticsOverview from "./overview";
import InboundAnalyticsDistribution from "./distribution";
import InboundAnalyticsAgentPerformance from "./agent-performance";
import InboundAnalyticsIVRAnalysis from "./ivr-analysis";
import InboundAnalyticsRepeatedCallers from "./repeated-callers";
import QuickStats from "./quick-stats";
import Select from "@/components/select";
import useVocabStore from "@/store/vocab.slice";

export type InboundAnalyticsFilterBy = "all" | "team";
type Option<T> = {
  value: T;
  label: string;
};
export type InboundAnalyticsFilters = {
  fromDate: Date;
  toDate: Date;
  agents?: string[];
  filterBy: InboundAnalyticsFilterBy;
};

const filterByOptions = [
  { value: "all", label: "All" },
  { value: "team", label: "Team" },
];

const InboundAnalytics = () => {
  const { extensions } = useVocabStore();

  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [agents, setAgents] = useState<string[]>([]);
  const [filterBy, setFilterBy] = useState<Option<InboundAnalyticsFilterBy>>({
    value: "all",
    label: "All",
  });

  const [filters, setFilters] = useState<InboundAnalyticsFilters>({
    fromDate,
    toDate,
    agents,
    filterBy: filterBy.value,
  });

  return (
    <div className="page" id="inbound-analytics">
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
                postIcon={<CalendarIcon className="text-gray-400" />}
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
                postIcon={<CalendarIcon className="text-gray-400" />}
              >
                <DatePicker
                  className="min-w-36 flex-1"
                  placeholder="Enter to date"
                  value={toDate}
                  onChange={(date) => setToDate(date || new Date())}
                />
              </Field>
              {/* filter by */}
              <Select
                className="w-full"
                placeholder="Filter By"
                value={filterBy}
                onChange={setFilterBy}
                options={filterByOptions}
                label="Filter By"
                showSelectedTags={false}
              />
              {/* agents */}
              <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                <Select
                  className="w-full"
                  placeholder="Select agents"
                  value={agents}
                  onChange={setAgents}
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
                    filterBy: filterBy.value,
                  })
                }
              >
                <Search />
                Search
              </Button>
            </div>
          </StatsDetailedCard>
        </div>

        <QuickStats filters={filters} />

        <StatsDetailedCard
          title="Detailed Call Statistics"
          subtitle="View detailed statistics for inbound calls"
          icon={<Insights />}
          value=""
          color="primary"
        >
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview" className="flex items-center gap-1">
                <BarChartIcon />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="distribution"
                className="flex items-center gap-1"
              >
                <PieChart />
                Distribution
              </TabsTrigger>
              {filters.filterBy === "team" && (
                <TabsTrigger value="agents" className="flex items-center gap-1">
                  <Group />
                  Agent Performance
                </TabsTrigger>
              )}
              <TabsTrigger value="ivr" className="flex items-center gap-1">
                <Call />
                IVR Analysis
              </TabsTrigger>
              {filters.filterBy === "team" && (
                <TabsTrigger
                  value="repeated"
                  className="flex items-center gap-1"
                >
                  <PeopleAlt />
                  Repeated Callers
                </TabsTrigger>
              )}
              {filters.filterBy === "all" && (
                <TabsTrigger
                  value="inbound-call-distribution"
                  className="flex items-center gap-1"
                >
                  <PieChart />
                  Inbound Call Distribution
                </TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="overview">
              <InboundAnalyticsOverview filters={filters} />
            </TabsContent>
            <TabsContent value="distribution">
              <InboundAnalyticsDistribution filters={filters} />
            </TabsContent>
            <TabsContent value="ivr">
              <InboundAnalyticsIVRAnalysis filters={filters} />
            </TabsContent>
            <TabsContent value="agents">
              {/* <InboundAnalyticsAgentPerformance filters={filters} /> */}
            </TabsContent>
            <TabsContent value="repeated">
              {/* <InboundAnalyticsRepeatedCallers filters={filters} /> */}
            </TabsContent>
          </Tabs>
        </StatsDetailedCard>
      </div>
    </div>
  );
};

export default InboundAnalytics;
