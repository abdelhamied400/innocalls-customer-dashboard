"use client";

import useAuthStore from "@/store/auth.slice";
import ServiceLevelStats from "@/containers/user/ServiceLevelStats";
import ErgStats from "@/containers/user/ErgStats";
import CallDistributionStats from "@/containers/user/CallDistributionStats";
import BillingStats from "@/containers/user/BillingStats";

const Dashboard = () => {
  const { Organization } = useAuthStore();
  return (
    <div className="page" id="dashboard">
      <div className="flex flex-col gap-4">
        {Organization?.hasTenant && <ServiceLevelStats />}
        {Organization?.hasTenant && <CallDistributionStats />}
        {Organization?.hasTenant && <ErgStats />}
        <BillingStats />
      </div>
    </div>
  );
};

export default Dashboard;
