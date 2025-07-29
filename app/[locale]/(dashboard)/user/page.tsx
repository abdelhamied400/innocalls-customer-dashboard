"use client";

import useAuthStore from "@/store/auth.slice";
import CallDistributionStats from "@/containers/user/CallDistributionStats";
import BillingStats from "@/containers/user/BillingStats";
import CallSummaryStats from "@/containers/user/CallSummaryStats";
import HistoricalStats from "@/containers/user/HistoricalStats";
import QuickStats from "@/containers/user/QuickStats";
import PerformanceStats from "@/containers/user/PerformanceStats";
import { useSession } from "next-auth/react";
import useVocabStore from "@/store/vocab.slice";

const Dashboard = () => {
  const { Organization } = useAuthStore();
  const { data: session } = useSession();
  const { ergs } = useVocabStore();

  return (
    <div className="page" id="dashboard">
      <div className="flex flex-col gap-4">
        {Organization?.hasTenant && session?.user?.role === "Admin" && (
          <CallDistributionStats />
        )}
        {Organization?.hasTenant && <CallSummaryStats />}
        {Organization?.hasTenant && Array.isArray(ergs) && ergs.length > 0 && (
          <HistoricalStats />
        )}
        {Organization?.hasTenant && Array.isArray(ergs) && ergs.length > 0 && (
          <QuickStats />
        )}
        {Organization?.hasTenant && Array.isArray(ergs) && ergs.length > 0 && (
          <PerformanceStats />
        )}

        <BillingStats />
      </div>
    </div>
  );
};

export default Dashboard;
