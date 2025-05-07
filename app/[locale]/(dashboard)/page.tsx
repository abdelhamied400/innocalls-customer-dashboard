"use client";

import useAuthStore from "@/store/auth.slice";
import ServiceLevelStats from "@/containers/ServiceLevelStats";
import ErgStats from "@/containers/ErgStats";
import CallDistributionStats from "@/containers/CallDistributionStats";

const Dashboard = () => {
  const { Organization } = useAuthStore();
  return (
    <div className="page" id="dashboard" key={Organization?.id}>
      <div className="flex flex-col gap-4">
        <ServiceLevelStats />
        <CallDistributionStats />
        {Organization?.hasTenant && <ErgStats />}
      </div>
    </div>
  );
};

export default Dashboard;
