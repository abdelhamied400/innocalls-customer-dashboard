"use client";
import { useTranslations } from "@/providers/TranslationProvider";
import useAppStore from "@/store/app.slice";
import { useEffect } from "react";
import ActiveCampaignsTable from "./table";

const ActiveCampaigns = () => {
  const { setPageTitle } = useAppStore();
  const t = useTranslations("sidebar");

  useEffect(() => {
    setPageTitle(t("navigation.autoDialer"));
  }, []);

  return (
    <div className="page flex-1 overflow-hidden" id="auto-dialer">
      <div className="border rounded-xl h-full flex flex-col overflow-hidden">
        <ActiveCampaignsTable />
      </div>
    </div>
  );
};

export default ActiveCampaigns;
