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

const filterByOptions = [
  { value: "all", label: "All" },
  { value: "team", label: "Team" },
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
  schema: inboundFiltersSchema,
};

const InboundAnalytics = () => {
  const { extensions, ergs } = useVocabStore();

  const [currentTab, setCurrentTab] = useState<string>("overview");

  const { values, appliedValues, errors, setValue, reset, apply } =
    useFilterManager<InboundAnalyticsFilters>(inboundFilterConfig);

  // Helper states for UI components that need Option objects
  const [queueOption, setQueueOption] = useState<Option<string>>();
  const [filterByOption, setFilterByOption] = useState<
    Option<InboundAnalyticsFilterBy>
  >({
    value: "all",
    label: "All",
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
                postIcon={<CalendarIcon className="text-gray-400" />}
                error={errors.toDate}
              >
                <DatePicker
                  className="min-w-36 flex-1"
                  placeholder="Enter to date"
                  value={values.toDate}
                  onChange={(date) => setValue("toDate", date || new Date())}
                />
              </Field>
              {/* filter by */}
              <Select
                className="w-full"
                placeholder="Filter By"
                value={filterByOption}
                onChange={(option) => {
                  setFilterByOption(option);
                  setValue("filterBy", option?.value || "all");
                }}
                options={filterByOptions}
                label="Filter By"
                showSelectedTags={false}
                error={errors.filterBy}
              />
              {/* queue */}
              {filterByOption?.value === "team" && (
                <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                  <Select
                    className="w-full"
                    placeholder="Select queue"
                    value={queueOption}
                    onChange={(option) => {
                      setQueueOption(option);
                      setValue("queue", option?.value);
                    }}
                    options={
                      ergs?.map((erg) => ({
                        value: erg.name,
                        label: erg.name,
                      })) || []
                    }
                    label="Select Queue"
                    showSelectedTags={false}
                    error={errors.queue}
                  />
                </div>
              )}

              {/* agents */}
              {filterByOption?.value === "all" && (
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
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={reset}>
                Clear Filters
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
                Search
              </Button>
            </div>
          </StatsDetailedCard>
        </div>

        <QuickStats filters={appliedValues} />

        <StatsDetailedCard
          title="Detailed Call Statistics"
          subtitle="View detailed statistics for inbound calls"
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
                Summary
              </TabsTrigger>
              <TabsTrigger
                value="distribution"
                className="flex items-center gap-1"
              >
                <PieChart />
                Call Distribution
              </TabsTrigger>
              {appliedValues.filterBy === "team" && (
                <TabsTrigger value="agents" className="flex items-center gap-1">
                  <PeopleAlt />
                  Team Performance
                </TabsTrigger>
              )}
              <TabsTrigger value="ivr" className="flex items-center gap-1">
                <Call />
                IVR Insights
              </TabsTrigger>
              {appliedValues.filterBy === "team" && (
                <TabsTrigger
                  value="repeated"
                  className="flex items-center gap-1"
                >
                  <Group />
                  Frequent Callers
                </TabsTrigger>
              )}
              {appliedValues.filterBy === "all" && (
                <TabsTrigger
                  value="date-distribution"
                  className="flex items-center gap-1"
                >
                  <CalendarIcon />
                  Date Trends
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
          </Tabs>
        </StatsDetailedCard>
      </div>
    </div>
  );
};

export default InboundAnalytics;
