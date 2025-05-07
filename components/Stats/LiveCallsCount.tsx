import StatsCard from "@/components/StatsCard";
import React from "react";

const LiveCallsCount = () => {
  return (
    <StatsCard
      icon={<img src="/assets/icons/stats/phone.svg" alt="Live Calls Icon" />}
      title="Live Calls Count"
      value="40,000" // Replace with actual data
      className="bg-blue-100 shadow-none"
      info={
        <p className="text-sm text-gray-500">
          <span className="text-green-500">+120,34%</span> Up from yesterday
        </p>
      }
    ></StatsCard>
  );
};

export default LiveCallsCount;
