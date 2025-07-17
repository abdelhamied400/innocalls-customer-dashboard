"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import StatsCard from "@/components/StatsCard";
import { BarChart3, Clock, PieChart, CalendarIcon } from "lucide-react";
import DatePicker from "@/components/ui/date-picker";
import Field from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import {
  AddIcCall,
  AssignmentTurnedIn,
  Insights,
  AvTimer,
  BarChart as BarChartIcon,
  HourglassBottom,
  RingVolume,
  Group,
  Call,
  PeopleAlt,
} from "@mui/icons-material";
import StatsDetailedCard from "@/components/StatsDetailedCard";
import InboundAnalyticsOverview from "./overview";
import InboundAnalyticsDistribution from "./distribution";
import InboundAnalyticsAgentPerformance from "./agent-performance";
import InboundAnalyticsIVRAnalysis from "./ivr-analysis";
import InboundAnalyticsRepeatedCallers from "./repeated-callers";
import { useQuery } from "@tanstack/react-query";
import inboundAnalyticsService from "@/services/inbound-analytics.service";

const InboundAnalytics = () => {
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());

  const { data: inboundAnalyticsData, isLoading } = useQuery({
    queryKey: ["inboundAnalytics", fromDate, toDate],
    queryFn: () => inboundAnalyticsService.getAnalyticsStats(fromDate, toDate),
    refetchOnWindowFocus: false,
  });

  console.log(inboundAnalyticsData);

  return (
    <div className="page" id="inbound-analytics">
      <div className="flex flex-col gap-2">
        <div className="filters">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Date Range Search
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex items-center gap-2">
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
              <Button>
                <CalendarIcon className="w-4 h-4 mr-2" />
                Search
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="stats grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          <StatsCard
            icon={<AddIcCall className="w-6 h-6" />}
            title="Total Calls"
            value="598"
            color="success"
          />
          <StatsCard
            icon={<Clock className="w-6 h-6" />}
            title="Avg Wait Time"
            value="00:00:11"
            color="info"
          />
          <StatsCard
            icon={<AvTimer className="w-6 h-6" />}
            title="Avg Talk Time"
            value="00:01:20"
            color="primary"
          />
          <StatsCard
            icon={<AssignmentTurnedIn className="w-6 h-6" />}
            title="Completed Calls"
            value="450"
            color="success"
          />
          <StatsCard
            icon={<HourglassBottom className="w-6 h-6" />}
            title="Timeout Calls"
            value="50"
            color="warning"
          />
          <StatsCard
            icon={<RingVolume className="w-6 h-6" />}
            title="Abandoned Calls"
            value="98"
            color="destructive"
          />
        </div>
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
              <TabsTrigger value="agents" className="flex items-center gap-1">
                <Group />
                Agent Performance
              </TabsTrigger>
              <TabsTrigger value="ivr" className="flex items-center gap-1">
                <Call />
                IVR Analysis
              </TabsTrigger>
              <TabsTrigger value="repeated" className="flex items-center gap-1">
                <PeopleAlt />
                Repeated Callers
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <InboundAnalyticsOverview />
            </TabsContent>
            <TabsContent value="distribution">
              <InboundAnalyticsDistribution />
            </TabsContent>
            <TabsContent value="agents">
              <InboundAnalyticsAgentPerformance />
            </TabsContent>
            <TabsContent value="ivr">
              <InboundAnalyticsIVRAnalysis />
            </TabsContent>
            <TabsContent value="repeated">
              <InboundAnalyticsRepeatedCallers />
            </TabsContent>
          </Tabs>
        </StatsDetailedCard>
      </div>
    </div>
  );
};

export default InboundAnalytics;
