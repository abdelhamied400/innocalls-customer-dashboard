"use client";

import { useEffect } from "react";
import useAuthStore from "@/store/auth.slice";
import useAppStore from "@/store/app.slice";
import { useTranslations } from "next-intl";
import LiveCalls from "./LiveCalls";
import Agents from "./Agents";
import PerformanceStats from "./PerformanceStats";
import QueueManagement from "./QueueManagement";

const LiveMonitoring = () => {
  const { Organization } = useAuthStore();
  const { setPageTitle } = useAppStore();
  const t = useTranslations("dashboard.containers");

  useEffect(() => {
    setPageTitle(t("liveMonitoringStats"));

    // Cleanup when component unmounts
    return () => setPageTitle(null);
  }, [setPageTitle, t]);

  return (
    <div className="page" id="live-monitoring">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-7 space-y-6">
            <LiveCalls />
            {Organization?.hasTenant && <PerformanceStats />}
            {Organization?.hasTenant && <QueueManagement />}
          </div>
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <Agents />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMonitoring;
