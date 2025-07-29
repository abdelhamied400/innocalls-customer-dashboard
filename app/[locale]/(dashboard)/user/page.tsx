"use client";

import useAuthStore from "@/store/auth.slice";
import CallDistributionStats from "@/containers/user/CallDistributionStats";
import BillingStats from "@/containers/user/BillingStats";
import CallSummaryStats from "@/containers/user/CallSummaryStats";
import HistoricalStats from "@/containers/user/HistoricalStats";
import QuickStats from "@/containers/user/QuickStats";
import PerformanceStats from "@/containers/user/PerformanceStats";

const Dashboard = () => {
  const { Organization } = useAuthStore();
  return (
    <div className="page" id="dashboard">
      <div className="flex flex-col gap-4">
        {Organization?.hasTenant && <CallDistributionStats />}
        {Organization?.hasTenant && <CallSummaryStats />}
        {Organization?.hasTenant && <HistoricalStats />}
        {Organization?.hasTenant && <QuickStats />}
        {Organization?.hasTenant && <PerformanceStats />}

        <BillingStats />
      </div>
    </div>
  );
};

export default Dashboard;
