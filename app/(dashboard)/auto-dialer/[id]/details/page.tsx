"use client";
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

const AutoDialerCampaignDetails = () => {
  // const t = useTranslations("autoDialer.campaignDetails");
  const { id } = useParams();
  const { data: campaign, isLoading } = useQuery({
    queryKey: ["auto-dialer-campaign", id],
    queryFn: () => autoDialerService.getCampaign(id as string),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!campaign) {
    return <div>Campaign not found</div>;
  }

  return (
    <div className="auto-dialer-campaign-details flex flex-col gap-4">
      <div className="campaign-details flex flex-col gap-2">
        <h3>Campaign Details</h3>
        <div className="border rounded-lg p-4 flex flex-col gap-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 divide-x">
            <Property label="Campaign Name" value={campaign.name} />
            <Property
              label="Waiting Customer Count"
              value={campaign.waitingCustomerCount}
            />
            <Property label="Trials Count" value={campaign.trialsCount} />
          </div>
          <hr />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 divide-x">
            <Property label="Wrap Up Time" value={campaign.wrapUpTime} />
            <Property
              label="Delay Minutes Between Trials"
              value={campaign.delayMinutesBetweenTrials}
            />
            <Property
              label="Hide Caller Info"
              value={campaign.hideCallerInfo ? "Yes" : "No"}
            />
          </div>
          <hr />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 divide-x">
            <Property
              label="Agent Can Logout And Rejoin"
              value={campaign.agentCanLogoutAndRejoin ? "Yes" : "No"}
            />
          </div>
        </div>
      </div>
      <div className="campaign-scheduling flex flex-col gap-2">
        <h3>Campaign Scheduling</h3>
        <div className="border rounded-lg p-4 flex flex-col gap-4">
          <div className={cn("flex gap-4 divide-x")}>
            <Property
              className="flex-1"
              label="Duration Type"
              value={
                campaign.durationType === "time-limited"
                  ? "Time Limited"
                  : "Agent Availability"
              }
            />
            <Property
              className="flex-1"
              label="Max Wait Time (Seconds)"
              value={campaign.maxWaitTime}
            />
            <Property
              className="flex-1"
              label="Waiting Customer Count"
              value={campaign.waitingCustomerCount}
            />
            {campaign.durationType === "time-limited" && (
              <>
                <Property
                  className="flex-1"
                  label="From Time"
                  value={campaign.fromTime}
                />
                <Property
                  className="flex-1"
                  label="To Time"
                  value={campaign.toTime}
                />
                <Property
                  className="flex-1"
                  label="Time Zone"
                  value={campaign.timezone}
                />
              </>
            )}
          </div>
        </div>
      </div>
      <div className="customers-list flex flex-col gap-2 border rounded-lg">
        <div className="header p-4 bg-neutral-100 rounded-t-lg">
          <h3>Customers List</h3>
        </div>
        <div className="p-4 flex flex-col gap-4">
          <FileAttachment
            fileName={campaign.fileName}
            fileType="CSV"
            onDownload={() => {}}
          />
        </div>
      </div>
      <div className="sound flex flex-col gap-2 border rounded-lg">
        <div className="header p-4 bg-neutral-100 rounded-t-lg">
          <h3>Sound</h3>
        </div>
        <div className="flex gap-4 divide-x p-4">
          <div className="pe-3 flex-1">
            <FileAttachment
              fileName={campaign.loopSoundFileName}
              fileType="MP3"
              onDownload={() => {}}
            />
          </div>
          <Property
            className="flex-1"
            label="Play Announcement"
            value={campaign.mainSoundFileName ? "Yes" : "No"}
          />
          {campaign.mainSoundFileName && (
            <FileAttachment
              className="flex-1"
              fileName={campaign.mainSoundFileName}
              fileType="MP3"
              onDownload={() => {}}
            />
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <div className="caller-ids flex flex-col gap-2 border rounded-lg">
          <div className="header p-4 bg-neutral-100 rounded-t-lg">
            <h3>Caller IDs</h3>
          </div>

          <Table>
            <TableHeader className="bg-neutral-100">
              <TableRow>
                <TableHead>Caller IDs</TableHead>
                <TableHead>Destination</TableHead>
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
            <h3>Attached Agents</h3>
          </div>
          <div className="p-2 flex flex-wrap gap-2">
            {campaign.assignedAgents.map((agent, index) => (
              <div
                key={index}
                className="badge p-2 rounded-full bg-neutral-100"
              >
                {agent}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoDialerCampaignDetails;
