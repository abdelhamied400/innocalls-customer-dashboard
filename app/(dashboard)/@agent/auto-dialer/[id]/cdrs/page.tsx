"use client";
import { useTranslations } from "@/providers/TranslationProvider";
import useAppStore from "@/store/app.slice";
import { useEffect } from "react";
import AgentCampaignCdrsTable from "./table";

const AgentCampaignCdrs = () => {
  const { setPageTitle } = useAppStore();
  const t = useTranslations("autoDialerAgent");

  useEffect(() => {
    setPageTitle(t("cdrsTitle"));
  }, []);

  return (
    <div className="page flex-1 overflow-hidden">
      <div className="border rounded-xl h-full flex flex-col overflow-hidden">
        <AgentCampaignCdrsTable />
      </div>
    </div>
  );
};

export default AgentCampaignCdrs;
