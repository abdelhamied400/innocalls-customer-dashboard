"use client";
import LinkTabs, { LinkTab } from "@/components/LinkTabs";
import { Badge } from "@/components/ui/badge";
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

  const showUncompleted =
    !isLoading &&
    campaign &&
    ["in-progress", "active", "paused"].includes(campaign.status);

  const { data: uncompletedData } = useLocalizedQuery({
    queryKey: ["auto-dialer-uncompleted-requests", id, { page: 1, limit: 1 }],
    queryFn: () =>
      autoDialerService.fetchUncompletedRequests(id as string, {
        page: 1,
        limit: 1,
      }),
    enabled: !!showUncompleted,
  });

  const uncompletedCount = uncompletedData?.totalItems ?? 0;

  return (
    <div className="campaign-details-layout flex flex-col gap-4">
      <div className="header flex flex-wrap justify-between items-center gap-2">
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
          {showUncompleted && (
            <LinkTab href={`/auto-dialer/${id}/details/uncompleted`}>
              <span className="flex items-center gap-1.5">
                {t("tabs.uncompleted")}
                {uncompletedCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="px-1.5 py-0 text-xs min-w-[1.25rem] justify-center"
                  >
                    {uncompletedCount}
                  </Badge>
                )}
              </span>
            </LinkTab>
          )}
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
