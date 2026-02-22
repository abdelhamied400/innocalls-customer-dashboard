"use client";
import AutoDialerCampaignCdrsTable from "./table";
import autoDialerService from "@/services/auto-dialer.service";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { useParams } from "next/navigation";
import { useTranslations } from "@/providers/TranslationProvider";
import { ListAltOutlined } from "@mui/icons-material";

const CDRS_ALLOWED_STATUSES = [
  "completed",
  "finished",
  "in-progress",
  "active",
  "paused",
];

const AutoDialerCampaignCdrs = () => {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations("autoDialer.campaignCdrs");

  const { data: campaign, isLoading } = useLocalizedQuery({
    queryKey: ["auto-dialer-campaign", id],
    queryFn: () => autoDialerService.getCampaign(id as string),
  });

  if (isLoading) {
    return (
      <div className="rounded-lg bg-white p-6 text-gray-500 shadow">
        <p className="text-sm">{t("title")}</p>
      </div>
    );
  }

  if (!campaign || !CDRS_ALLOWED_STATUSES.includes(campaign.status)) {
    return (
      <div className="rounded-lg bg-white p-8 shadow">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-3 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
            <ListAltOutlined />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            {t("notAvailable.title")}
          </h3>
          <p className="text-sm text-gray-500">
            {t("notAvailable.description")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auto-dialer-campaign-cdrs">
      <AutoDialerCampaignCdrsTable />
    </div>
  );
};

export default AutoDialerCampaignCdrs;
