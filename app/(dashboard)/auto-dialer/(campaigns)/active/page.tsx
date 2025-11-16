"use client";
import useAppStore from "@/store/app.slice";
import AutoDialerActiveCampaignsTable from "./table";
import { useEffect } from "react";
import { useTranslations } from "@/providers/TranslationProvider";

type AutoDialerActiveCampaignsProps = object;
const AutoDialerActiveCampaigns = ({}: AutoDialerActiveCampaignsProps) => {
  const { setPageTitle } = useAppStore();
  const t = useTranslations("sidebar");

  useEffect(() => {
    setPageTitle(t("navigation.autoDialer"));
  }, []);

  return (
    <div className="page flex-1 overflow-hidden" id="auto-dialer">
      <div className="border rounded-xl h-full flex flex-col overflow-hidden">
        <AutoDialerActiveCampaignsTable />
      </div>
    </div>
  );
};

export default AutoDialerActiveCampaigns;
