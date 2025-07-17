// NEW: Queue Analytics Page
"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AnalyticsTabs from "@/components/Analytics/AnalyticsTabs";
import DateRangeSearch from "@/components/Analytics/DateRangeSearch";
import { ListChecks, AlertTriangle } from "lucide-react";
import AbandonedCallsChart from "@/components/Analytics/AbandonedCallsChart";
import ExitTimeoutChart from "@/components/Analytics/ExitTimeoutChart";

// Placeholder queue list
const queueList = [
  { id: "q1", name: "Support" },
  { id: "q2", name: "Sales" },
  { id: "q3", name: "Billing" },
];

// Placeholder data (replace with real queue unanswered data)
const queueUnansweredData = {
  abandonedCalls: {
    totalAbandonedCalls: 42,
    uniqueCallersAbandoned: 35,
    queuesWithAbandons: 2,
    avgWaitTimeBeforeAbandon: 60,
    minWaitTimeBeforeAbandon: 10,
    maxWaitTimeBeforeAbandon: 180,
    avgInitialQueuePosition: 2.1,
    minInitialQueuePosition: 1,
    maxInitialQueuePosition: 7,
    quickAbandons_0_10s: 10,
    shortWait_11_30s: 15,
    mediumWait_31_60s: 8,
    longWait_1_2min: 6,
    veryLongWait_2min_plus: 3,
    peakAbandonHour: 14,
  },
  exitTimeout: {
    totalTimeoutCalls: 18,
    uniqueCallersTimeout: 15,
    queuesWithTimeouts: 1,
    avgWaitTimeBeforeTimeout: 120,
    minWaitTimeBeforeTimeout: 60,
    maxWaitTimeBeforeTimeout: 300,
    avgInitialQueuePosition: 3.5,
    minInitialQueuePosition: 1,
    maxInitialQueuePosition: 10,
    quickTimeouts_0_10s: 2,
    shortWait_11_30s: 4,
    mediumWait_31_60s: 5,
    longWait_1_2min: 5,
    veryLongWait_2min_plus: 2,
    peakTimeoutHour: 15,
  },
};

const tabs = [
  { id: "unanswered", label: "Unanswered Calls", icon: <AlertTriangle className="w-4 h-4" /> },
];

const QueueAnalyticsPage = () => {
  const [selectedQueue, setSelectedQueue] = useState(queueList[0].id);

  const handleDateRangeChange = (fromDate:Date, toDate:Date) => {
    // TODO: Fetch/filter data by date
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <DateRangeSearch onDateRangeChange={handleDateRangeChange} />
        <div>
          <label htmlFor="queue-select" className="block text-sm font-medium text-gray-700 mb-1">
            Queue Name
          </label>
          <select
            id="queue-select"
            value={selectedQueue}
            onChange={e => setSelectedQueue(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            {queueList.map(q => (
              <option key={q.id} value={q.id}>{q.name}</option>
            ))}
          </select>
        </div>
      </div>
      <AnalyticsTabs tabs={tabs} defaultTab="unanswered">
        {[
          <div className="space-y-6" key="unanswered">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Queue Unanswered Calls Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AbandonedCallsChart data={queueUnansweredData.abandonedCalls} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-purple-600" />
                  Queue Exit Timeout Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ExitTimeoutChart data={queueUnansweredData.exitTimeout} />
              </CardContent>
            </Card>
          </div>
        ]}
      </AnalyticsTabs>
    </div>
  );
};

export default QueueAnalyticsPage; 