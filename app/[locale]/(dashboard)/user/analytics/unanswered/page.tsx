"use client";

import React, { useState } from "react";
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
import Select from "@/components/select";
import { Input } from "@/components/ui/input";
import useVocabStore from "@/store/vocab.slice";
import InboundDistribution from "./inbound-distribution";
import InboundUnansweredHourly from "./inbound-hourly";
import OutboundDistribution from "./outbound-distribution";
import OutboundUnansweredHourly from "./outbound-hourly";
import QuickStats from "./quick-stats";

type Option = {
  value: string;
  label: string;
};
export type UnAnsweredAnalyticsFilters = {
  fromDate: Date;
  toDate: Date;
  agents: Option[];
  slaCompliance: number;
};

const UnansweredAnalytics = () => {
  const { extensions } = useVocabStore();
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [agents, setAgents] = useState<Option[]>([]);
  const [slaCompliance, setSlaCompliance] = useState<number>(10);

  const [filters, setFilters] = useState<UnAnsweredAnalyticsFilters>({
    fromDate,
    toDate,
    agents,
    slaCompliance,
  });

  return (
    <div className="page" id="unanswered-analytics">
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

        <QuickStats filters={filters} />

        <div className="analytics-tabs">
          <StatsDetailedCard
            title="Unanswered Analytics"
            subtitle="View detailed analytics for unanswered calls"
            icon={<Insights />}
            value=""
            color="primary"
          >
            <Tabs defaultValue="inbound" className="w-full">
              <TabsList>
                <TabsTrigger value="inbound">Inbound Unanswered</TabsTrigger>
                <TabsTrigger value="outbound">Outbound Unanswered</TabsTrigger>
              </TabsList>

              <TabsContent value="inbound" className="flex flex-col gap-4">
                <InboundDistribution filters={filters} />
                <InboundUnansweredHourly filters={filters} />
              </TabsContent>

              <TabsContent value="outbound" className="flex flex-col gap-4">
                <OutboundDistribution filters={filters} />
                <OutboundUnansweredHourly filters={filters} />
              </TabsContent>
            </Tabs>
          </StatsDetailedCard>
        </div>
      </div>
    </div>
  );
};

export default UnansweredAnalytics;
