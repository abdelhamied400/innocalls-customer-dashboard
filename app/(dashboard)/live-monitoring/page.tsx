"use client";

import { useEffect } from "react";
import useAuthStore from "@/store/auth.slice";
import useAppStore from "@/store/app.slice";
import { useTranslations } from "@/providers/TranslationProvider";
import LiveCalls from "./LiveCalls";
import Agents from "./Agents";
import PerformanceStats from "./PerformanceStats";
import QueueManagement from "./QueueManagement";
import hasTenant from "@/containers/hasTenant";
import useLayoutManager from "@/hooks/use-layout-manager";
import { cn } from "@/lib/utils";

const LiveMonitoring = () => {
  const { Organization } = useAuthStore();
  const { setPageTitle } = useAppStore();
  const t = useTranslations("dashboard.containers");
  const { layoutVariant } = useLayoutManager();

  useEffect(() => {
    setPageTitle(t("liveMonitoringStats"));

    // Cleanup when component unmounts
    return () => setPageTitle(null);
  }, []);

  return (
    <div className="page" id="live-monitoring">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* Main Content */}
          <div
            className={cn(
              "space-y-6",
              layoutVariant !== "both-open" ? "lg:col-span-7" : "lg:col-span-10"
            )}
          >
            <LiveCalls />
            {Organization?.hasTenant && <PerformanceStats />}
            {Organization?.hasTenant && <QueueManagement />}
          </div>
          {/* Sidebar */}
          <div
            className={cn(
              "",
              layoutVariant !== "both-open" ? "lg:col-span-3" : "lg:col-span-10"
            )}
          >
            <Agents />
          </div>
        </div>
      </div>
    </div>
  );
};

export default hasTenant(LiveMonitoring);
