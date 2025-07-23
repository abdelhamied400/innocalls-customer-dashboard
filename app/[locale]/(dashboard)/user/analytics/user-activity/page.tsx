"use client";

import React, { useState } from "react";

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
import { z } from "zod";

type Option = {
  value: string;
  label: string;
};

export type UserActivityAnalyticsFilters = {
  fromDate: Date;
  toDate: Date;
  agents: Option[];
  slaCompliance: number;
};

const today = new Date();
const lastMonth = new Date();
lastMonth.setDate(today.getDate() - 30);

const defaultFilters: UserActivityAnalyticsFilters = {
  fromDate: lastMonth,
  toDate: today,
  agents: [],
  slaCompliance: 10,
};

const UserActivityAnalytics = () => {
  const { extensions } = useVocabStore();
  const [fromDate, setFromDate] = useState<Date>(defaultFilters.fromDate);
  const [toDate, setToDate] = useState<Date>(defaultFilters.toDate);
  const [agents, setAgents] = useState<Option[]>(defaultFilters.agents);
  const [slaCompliance, setSlaCompliance] = useState<number>(
    defaultFilters.slaCompliance
  );

  const [filters, setFilters] = useState({
    fromDate,
    toDate,
    agents,
    slaCompliance,
  });

  const [filtersErrors, setFiltersErrors] = useState<
    Record<keyof UserActivityAnalyticsFilters, string>
  >({
    fromDate: "",
    toDate: "",
    agents: "",
    slaCompliance: "",
  });

  const handleClearFilters = () => {
    setFilters(defaultFilters);
    setFromDate(defaultFilters.fromDate);
    setToDate(defaultFilters.toDate);
    setAgents(defaultFilters.agents);
    setSlaCompliance(defaultFilters.slaCompliance);
    setFiltersErrors({
      fromDate: "",
      toDate: "",
      agents: "",
      slaCompliance: "",
    });
  };
  const handleApplyFilters = () => {
    setFiltersErrors({
      fromDate: "",
      toDate: "",
      agents: "",
      slaCompliance: "",
    });

    const filtersSchema = z
      .object({
        fromDate: z.date(),
        toDate: z.date(),
        agents: z.array(z.object({ value: z.string(), label: z.string() })),
        slaCompliance: z.number().min(0).max(100),
      })
      .refine(
        (data) => {
          const diff =
            (data.toDate.getTime() - data.fromDate.getTime()) /
            (1000 * 60 * 60 * 24);
          return diff >= 0 && diff <= 30;
        },
        {
          message: "Date range must be between 0 and 30 days.",
          path: ["toDate"],
        }
      );

    const result = filtersSchema.safeParse({
      fromDate,
      toDate,
      agents,
      slaCompliance,
    });
    if (!result.success) {
      const zodIssuesToObject = (issues: z.ZodIssue[]) =>
        issues.reduce((acc, issue) => {
          acc[issue.path.join(".")] = issue.message;
          return acc;
        }, {} as Record<string, string>);
      const errors = zodIssuesToObject(result.error.issues);
      setFiltersErrors(errors);
      return;
    }

    // Apply filters
    setFilters(result.data);
  };

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
                error={filtersErrors.fromDate}
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
                error={filtersErrors.toDate}
              >
                <DatePicker
                  className="min-w-36 flex-1"
                  placeholder="Enter to date"
                  value={toDate}
                  onChange={(date) => setToDate(date || new Date())}
                />
              </Field>
              <Field
                label="SLA"
                postIcon={<AccessTime className="text-gray-400" />}
                error={filtersErrors.slaCompliance}
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
                  error={filtersErrors.agents}
                  isClearable
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClearFilters}>
                Clear Filters
              </Button>
              <Button onClick={handleApplyFilters}>Apply Filters</Button>
            </div>
          </StatsDetailedCard>
        </div>
        <QuickStats filters={filters} />
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
              <CallDistributionAnalytics filters={filters} />
            </TabsContent>
            <TabsContent value="call-stats">
              <CallStats filters={filters} />
            </TabsContent>
            <TabsContent value="sla-compliance">
              <SlaComplianceAnalytics filters={filters} />
            </TabsContent>
          </Tabs>
        </StatsDetailedCard>
      </div>
    </div>
  );
};

export default UserActivityAnalytics;
