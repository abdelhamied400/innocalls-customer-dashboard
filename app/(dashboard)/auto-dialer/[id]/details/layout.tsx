"use client";
import LinkTabs, { LinkTab } from "@/components/LinkTabs";
import { useParams } from "next/navigation";
import { PropsWithChildren } from "react";
import CampaignActions from "../../shared/CampaignActions";
import autoDialerService from "@/services/auto-dialer.service";
import { useQuery } from "@tanstack/react-query";

type CampaignDetailsLayoutProps = PropsWithChildren<{}>;
const CampaignDetailsLayout = ({ children }: CampaignDetailsLayoutProps) => {
  const { id } = useParams();

  const { data: campaign, isLoading } = useQuery({
    queryKey: ["auto-dialer-campaign", id],
    queryFn: () => autoDialerService.getCampaign(id as string),
  });

  return (
    <div className="campaign-details-layout flex flex-col gap-4">
      <div className="header flex justify-between items-center">
        <LinkTabs>
          <LinkTab href={`/auto-dialer/${id}/details/metrics`}>
            Campaign Metrics
          </LinkTab>
          <LinkTab href={`/auto-dialer/${id}/details/cdrs`}>
            Campaign CDRs
          </LinkTab>
          <LinkTab href={`/auto-dialer/${id}/details`}>
            Campaign Details
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
