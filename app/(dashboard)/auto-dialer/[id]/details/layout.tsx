"use client";
import LinkTabs, { LinkTab } from "@/components/LinkTabs";
import { useTranslations } from "@/providers/TranslationProvider";
import { useParams } from "next/navigation";
import { PropsWithChildren } from "react";
import CampaignActions from "../../shared/CampaignActions";
import autoDialerService from "@/services/auto-dialer.service";
import { useQuery } from "@tanstack/react-query";

type CampaignDetailsLayoutProps = PropsWithChildren<{}>;
const CampaignDetailsLayout = ({ children }: CampaignDetailsLayoutProps) => {
  const { id } = useParams();
  const t = useTranslations("autoDialer.campaignDetails");

  const { data: campaign, isLoading } = useQuery({
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
    </div>
  );
};

export default CampaignDetailsLayout;
