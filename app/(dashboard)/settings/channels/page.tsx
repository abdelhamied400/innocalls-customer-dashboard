"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "@/providers/TranslationProvider";
import omnichannelService from "@/services/omnichannel.service";
import type { Channel, ChannelType } from "@/types/omnichannel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ChannelIcon, {
  channelLabels,
} from "@/components/omnichannel/ChannelIcon";
import ChannelSetupDialog from "@/components/omnichannel/ChannelSetupDialog";
import {
  CheckCircle,
  Cancel,
  Settings,
  LinkOff,
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";

const allChannelTypes: ChannelType[] = [
  "whatsapp",
  "live_chat",
  "voice",
  "messenger",
  "x",
  "instagram",
  "telegram",
];

const channelDescriptions: Record<ChannelType, string> = {
  whatsapp: "WhatsApp Business API integration",
  live_chat: "Embedded website chat widget",
  voice: "Innocalls voice channel",
  messenger: "Facebook Messenger integration",
  x: "X (Twitter) direct messages",
  instagram: "Instagram direct messages",
  telegram: "Telegram bot integration",
};

const channelBgColors: Record<ChannelType, string> = {
  whatsapp: "bg-green-50",
  live_chat: "bg-purple-50",
  voice: "bg-primary-50",
  messenger: "bg-blue-50",
  x: "bg-gray-50",
  instagram: "bg-pink-50",
  telegram: "bg-sky-50",
};

const ChannelsSettingsPage = () => {
  const t = useTranslations("omnichannel.channels");
  const [connectedChannels, setConnectedChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadChannels = () => {
    omnichannelService.getChannels().then((data) => {
      setConnectedChannels(data);
      setIsLoading(false);
    }).catch(() => {
      setConnectedChannels([]);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    loadChannels();
  }, []);

  const getChannelData = (type: ChannelType): Channel | null => {
    return connectedChannels.find((c) => c.type === type) ?? null;
  };

  const handleConnect = (type: ChannelType) => {
    setSelectedChannel({
      id: "",
      type,
      name: channelLabels[type],
      status: "disconnected",
      description: channelDescriptions[type],
      config: {},
      createdAt: "",
      updatedAt: "",
    });
    setDialogOpen(true);
  };

  const handleConfigure = (channel: Channel) => {
    setSelectedChannel(channel);
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-100 p-6"
          >
            <div className="flex items-start gap-4">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const connectedCount = connectedChannels.filter(
    (c) => c.status === "connected",
  ).length;

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{t("title")}</h2>
        <p className="text-sm text-gray-500 mt-0.5">{t("subtitle")}</p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3">
        <Badge variant="success" className="gap-1.5 text-xs">
          <CheckCircle className="!text-sm" />
          {connectedCount} {t("statusLabels.connected")}
        </Badge>
        <Badge variant="secondary" className="gap-1.5 text-xs">
          <LinkOff className="!text-sm" />
          {allChannelTypes.length - connectedCount} {t("statusLabels.disconnected")}
        </Badge>
      </div>

      {/* All Channel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {allChannelTypes.map((type) => {
          const existing = getChannelData(type);
          const isConnected = existing?.status === "connected";
          const isPending = existing?.status === "pending";

          return (
            <div
              key={type}
              className={`bg-white rounded-xl border p-5 transition-all hover:shadow-md ${
                isConnected
                  ? "border-green-200 hover:border-green-300"
                  : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl ${channelBgColors[type]} flex items-center justify-center shrink-0`}
                >
                  <ChannelIcon channel={type} className="!text-2xl" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">
                      {channelLabels[type]}
                    </h3>
                    {isConnected && (
                      <Badge
                        variant="success"
                        className="text-[10px] px-2 py-0.5 gap-1 shrink-0"
                      >
                        <CheckCircle className="!text-[10px]" />
                        {t("statusLabels.connected")}
                      </Badge>
                    )}
                    {isPending && (
                      <Badge
                        variant="warning"
                        className="text-[10px] px-2 py-0.5 shrink-0"
                      >
                        {t("statusLabels.pending")}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {existing?.description ?? channelDescriptions[type]}
                  </p>
                  {existing?.connectedAt && (
                    <p className="text-[11px] text-gray-400 mt-2">
                      {t("connectedSince")}{" "}
                      {formatDistanceToNow(new Date(existing.connectedAt), {
                        addSuffix: true,
                      })}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-gray-50">
                {isConnected || isPending ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-xs rounded-lg"
                      onClick={() => handleConfigure(existing!)}
                    >
                      <Settings className="!text-sm" />
                      {t("configure")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-xs rounded-lg text-destructive-500 hover:text-destructive-600"
                      onClick={async () => {
                        await omnichannelService.deleteChannel(existing!.id);
                        loadChannels();
                      }}
                    >
                      <Cancel className="!text-sm" />
                      {t("disconnect")}
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    className="gap-1.5 text-xs rounded-lg"
                    onClick={() => handleConnect(type)}
                  >
                    {t("connect")}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Setup Dialog */}
      <ChannelSetupDialog
        channel={selectedChannel}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSaved={loadChannels}
      />
    </div>
  );
};

export default ChannelsSettingsPage;
