"use client";
import withPermission from "@/containers/withPermission";
import FileAttachment from "@/components/FileAttachment";
import Property from "@/components/Property";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/providers/TranslationProvider";
import autoDialerService from "@/services/auto-dialer.service";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import queryExtensions from "@/queries/queryExtensions";
import { useLocalizedQuery } from "@/hooks/use-localized-query";

const AutoDialerCampaignDetails = () => {
  const t = useTranslations("autoDialer.campaignDetails");
  const { id } = useParams();
  const { data: campaign, isLoading } = useQuery({
    queryKey: ["auto-dialer-campaign", id],
    queryFn: () => autoDialerService.getCampaign(id as string),
    gcTime: 0,
    refetchInterval: 10000,
  });
  const { data: extensions } = useLocalizedQuery(queryExtensions({}));

  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  if (!campaign) {
    return <div>{t("notFound")}</div>;
  }

  return (
    <div className="auto-dialer-campaign-details flex flex-col gap-4">
      <div className="campaign-details flex flex-col gap-2">
        <h3>{t("sections.campaignDetails")}</h3>
        <div className="border rounded-lg p-4 flex flex-col gap-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 divide-x">
            <Property label={t("fields.campaignName")} value={campaign.name} />
            <Property
              label={t("fields.waitingCustomerCount")}
              value={campaign.waitingCustomerCount}
            />
            <Property
              label={t("fields.trialsCount")}
              value={campaign.trialsCount}
            />
          </div>
          <hr />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 divide-x">
            <Property
              label={t("fields.wrapUpTime")}
              value={campaign.wrapUpTime}
            />
            <Property
              label={t("fields.delayMinutesBetweenTrials")}
              value={campaign.delayMinutesBetweenTrials}
            />
            <Property
              label={t("fields.hideCallerInfo")}
              value={
                campaign.hideCallerInfo ? t("booleans.yes") : t("booleans.no")
              }
            />
          </div>
          <hr />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 divide-x">
            <Property
              label={t("fields.agentCanLogoutAndRejoin")}
              value={
                campaign.agentCanLogoutAndRejoin
                  ? t("booleans.yes")
                  : t("booleans.no")
              }
            />
          </div>
        </div>
      </div>
      <div className="campaign-scheduling flex flex-col gap-2">
        <h3>{t("sections.campaignScheduling")}</h3>
        <div className="border rounded-lg p-4 flex flex-col gap-4">
          <div className={cn("flex flex-col lg:flex-row gap-4 divide-x")}>
            <Property
              className="flex-1"
              label={t("fields.durationType")}
              value={
                campaign.durationType === "time-limited"
                  ? t("durationTypes.timeLimited")
                  : t("durationTypes.agentAvailability")
              }
            />
            <Property
              className="flex-1"
              label={t("fields.maxWaitTimeSeconds")}
              value={campaign.maxWaitTime}
            />
            <Property
              className="flex-1"
              label={t("fields.waitingCustomerCount")}
              value={campaign.waitingCustomerCount}
            />
            {campaign.durationType === "time-limited" && (
              <>
                <Property
                  className="flex-1"
                  label={t("fields.fromTime")}
                  value={campaign.fromTime}
                />
                <Property
                  className="flex-1"
                  label={t("fields.toTime")}
                  value={campaign.toTime}
                />
                <Property
                  className="flex-1"
                  label={t("fields.timeZone")}
                  value={campaign.timezone}
                />
              </>
            )}
          </div>
        </div>
      </div>
      <div className="customers-list flex flex-col gap-2 border rounded-lg">
        <div className="header p-4 bg-neutral-100 rounded-t-lg">
          <h3>{t("sections.customersList")}</h3>
        </div>
        <div className="p-4 flex flex-col gap-4">
          {campaign.fileName ? (
            <FileAttachment
              fileName={campaign.fileName}
              fileType={t("fileTypes.csv")}
            />
          ) : (
            <p>{t("noFileAttached")}</p>
          )}
        </div>
      </div>
      <div className="sound flex flex-col gap-2 border rounded-lg">
        <div className="header p-4 bg-neutral-100 rounded-t-lg">
          <h3>{t("sections.sound")}</h3>
        </div>
        <div className="flex flex-col lg:flex-row gap-4 divide-x p-4">
          <div className="pe-3 flex-1">
            <FileAttachment
              fileName={campaign.loopSoundFileName}
              fileType={t("fileTypes.mp3")}
            />
          </div>
          <Property
            className="flex-1"
            label={t("fields.playAnnouncement")}
            value={
              campaign.mainSoundFileName ? t("booleans.yes") : t("booleans.no")
            }
          />
          {campaign.mainSoundFileName && (
            <FileAttachment
              className="flex-1"
              fileName={campaign.mainSoundFileName}
              fileType={t("fileTypes.mp3")}
            />
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <div className="caller-ids flex flex-col gap-2 border rounded-lg">
          <div className="header p-4 bg-neutral-100 rounded-t-lg">
            <h3>{t("sections.callerIds")}</h3>
          </div>

          <Table>
            <TableHeader className="bg-neutral-100">
              <TableRow>
                <TableHead>{t("fields.callerIds")}</TableHead>
                <TableHead>{t("fields.destination")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaign.callers.map((callerId, index) => (
                <TableRow key={index} className="border-0 hover:bg-transparent">
                  <TableCell>{callerId.callerNumber}</TableCell>
                  <TableCell>{callerId.destination}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="attached-agents flex flex-col gap-2 border rounded-lg">
          <div className="header p-4 bg-neutral-100 rounded-t-lg">
            <h3>{t("sections.attachedAgents")}</h3>
          </div>
          <div className="p-2 flex flex-wrap gap-2">
            {campaign.assignedAgents.map((agent, index) => {
              const ext = extensions?.find((e) => e.ext === String(agent));
              return (
                <div
                  key={index}
                  className="badge p-2 rounded-full bg-neutral-100"
                >
                  {ext?.name || agent}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withPermission(
  AutoDialerCampaignDetails,
  "fullAccessAutoDialerCampaigns",
);
