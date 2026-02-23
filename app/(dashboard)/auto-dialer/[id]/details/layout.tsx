"use client";
import LinkTabs, { LinkTab } from "@/components/LinkTabs";
import { useTranslations } from "@/providers/TranslationProvider";
import { useParams } from "next/navigation";
import { PropsWithChildren, ReactNode } from "react";
import CampaignActions from "../../shared/CampaignActions";
import autoDialerService from "@/services/auto-dialer.service";
import { useLocalizedQuery } from "@/hooks/use-localized-query";

type CampaignDetailsLayoutProps = PropsWithChildren<{
  updateMainInfoSheet: ReactNode;
}>;
const CampaignDetailsLayout = ({
  children,
  updateMainInfoSheet,
}: CampaignDetailsLayoutProps) => {
  const { id } = useParams();
  const t = useTranslations("autoDialer.campaignDetails");

  const { data: campaign, isLoading } = useLocalizedQuery({
    queryKey: ["auto-dialer-campaign", id],
    queryFn: () => autoDialerService.getCampaign(id as string),
  });

  return (
    <div className="campaign-details-layout flex flex-col gap-4">
      <div className="header flex justify-between items-center">
        <LinkTabs>
          <LinkTab href={`/auto-dialer/${id}/details/metrics`}>
            {t("tabs.metrics")}
          </LinkTab>
          <LinkTab href={`/auto-dialer/${id}/details/cdrs`}>
            {t("tabs.cdrs")}
          </LinkTab>
          <LinkTab href={`/auto-dialer/${id}/details`}>
            {t("tabs.details")}
          </LinkTab>
        </LinkTabs>
        {!isLoading && campaign && (
          <div className="actions">
            <CampaignActions campaign={campaign} variant="details" />
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg p-4">{children}</div>
      {updateMainInfoSheet}
    </div>
  );
};

export default CampaignDetailsLayout;
