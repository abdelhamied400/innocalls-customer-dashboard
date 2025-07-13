"use client";

import { useEffect } from "react";
import useAuthStore from "@/store/auth.slice";
import useAppStore from "@/store/app.slice";
import LiveMonitoringStats from "@/containers/user/LiveMonitoringStats";
import { useTranslations } from "next-intl";

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
        {Organization?.hasTenant && <LiveMonitoringStats />}
      </div>
    </div>
  );
};

export default LiveMonitoring; 