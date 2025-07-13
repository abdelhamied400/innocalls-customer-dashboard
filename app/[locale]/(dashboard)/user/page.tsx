"use client";

import useAuthStore from "@/store/auth.slice";
import CallDistributionStats from "@/containers/user/CallDistributionStats";
import ErgHistoricalStats from "@/containers/user/ErgHistoricalStats";
import BillingStats from "@/containers/user/BillingStats";

const Dashboard = () => {
  const { Organization } = useAuthStore();
  return (
    <div className="page" id="dashboard">
      <div className="flex flex-col gap-4">
        {Organization?.hasTenant && <CallDistributionStats />}
        {Organization?.hasTenant && <ErgHistoricalStats />}
        <BillingStats />
      </div>
    </div>
  );
};

export default Dashboard;
