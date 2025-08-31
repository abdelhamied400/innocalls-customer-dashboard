"use client";

import { useTranslations } from "@/providers/TranslationProvider";
import AgentStats from "./AgentStats";
import useAppStore from "@/store/app.slice";
import { useEffect } from "react";

const AgentDashboard = () => {
  const t = useTranslations("sidebar.navigation");
  const { setPageTitle } = useAppStore();

  useEffect(() => {
    setPageTitle(t("dashboard"));
  }, []);

  return (
    <div className="page" id="agent-dashboard">
      <div className="flex flex-col gap-4">{<AgentStats />}</div>
    </div>
  );
};

export default AgentDashboard;
