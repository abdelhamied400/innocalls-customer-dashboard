"use client";
import { useTranslations } from "@/providers/TranslationProvider";

const AutoDialerCampaignMetrics = () => {
  const t = useTranslations("autoDialer.campaignDetails");

  return (
    <div className="auto-dialer-campaign-metrics">
      <h1>{t("tabs.metrics")}</h1>
    </div>
  );
};

export default AutoDialerCampaignMetrics;
