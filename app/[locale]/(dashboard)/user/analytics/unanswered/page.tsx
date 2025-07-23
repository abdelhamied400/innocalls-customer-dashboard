"use client";

import React from "react";
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
import { useFilterManager } from "@/hooks/useFilterManager";
import { unansweredFiltersSchema } from "@/validation/unansweredFilters";
import InboundDistribution from "./inbound-distribution";
import InboundUnansweredHourly from "./inbound-hourly";
import OutboundDistribution from "./outbound-distribution";
import OutboundUnansweredHourly from "./outbound-hourly";
import QuickStats from "./quick-stats";

type Option = {
  value: string;
  label: string;
};

export type UnansweredAnalyticsFilters = {
  fromDate: Date;
  toDate: Date;
  agents: Option[];
};

const today = new Date();
const lastMonth = new Date();
lastMonth.setDate(today.getDate() - 30);

const unansweredFilterConfig = {
  defaultValues: {
    fromDate: lastMonth,
    toDate: today,
    agents: [],
  } as UnansweredAnalyticsFilters,
  schema: unansweredFiltersSchema,
};

const UnansweredAnalytics = () => {
  const { extensions } = useVocabStore();

  const { values, appliedValues, errors, setValue, reset, apply } =
    useFilterManager<UnansweredAnalyticsFilters>(unansweredFilterConfig);

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

        <QuickStats filters={appliedValues} />

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
                <InboundDistribution filters={appliedValues} />
                <InboundUnansweredHourly filters={appliedValues} />
              </TabsContent>

              <TabsContent value="outbound" className="flex flex-col gap-4">
                <OutboundDistribution filters={appliedValues} />
                <OutboundUnansweredHourly filters={appliedValues} />
              </TabsContent>
            </Tabs>
          </StatsDetailedCard>
        </div>
      </div>
    </div>
  );
};

export default UnansweredAnalytics;
