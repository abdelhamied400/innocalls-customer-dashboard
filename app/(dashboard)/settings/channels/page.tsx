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
import {
  CheckCircle,
  Cancel,
  HourglassEmpty,
  Add,
  Settings,
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";

const channelBgColors: Record<ChannelType, string> = {
  whatsapp: "bg-green-50",
  live_chat: "bg-purple-50",
  voice: "bg-primary-50",
  messenger: "bg-blue-50",
  x: "bg-gray-50",
  instagram: "bg-pink-50",
  telegram: "bg-sky-50",
};

const statusConfig: Record<
  string,
  { icon: React.ReactNode; variant: string; label: string }
> = {
  connected: {
    icon: <CheckCircle className="!text-sm" />,
    variant: "success",
    label: "connected",
  },
  disconnected: {
    icon: <Cancel className="!text-sm" />,
    variant: "destructive",
    label: "disconnected",
  },
  pending: {
    icon: <HourglassEmpty className="!text-sm" />,
    variant: "warning",
    label: "pending",
  },
};

const ChannelsSettingsPage = () => {
  const t = useTranslations("omnichannel.channels");
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    omnichannelService.getChannels().then((data) => {
      setChannels(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-100 p-6"
          >
            <div className="flex items-start gap-4">
              <Skeleton className="w-14 h-14 rounded-xl" />
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

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {t("title")}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">{t("subtitle")}</p>
        </div>
        <Button className="gap-2 rounded-lg">
          <Add className="!text-lg" />
          {t("addChannel")}
        </Button>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3">
        <Badge variant="success" className="gap-1.5 text-xs">
          <CheckCircle className="!text-sm" />
          {channels.filter((c) => c.status === "connected").length}{" "}
          {t("statusLabels.connected")}
        </Badge>
        <Badge variant="destructive" className="gap-1.5 text-xs">
          <Cancel className="!text-sm" />
          {channels.filter((c) => c.status === "disconnected").length}{" "}
          {t("statusLabels.disconnected")}
        </Badge>
      </div>

      {/* Channel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {channels.map((channel) => {
          const status = statusConfig[channel.status];
          return (
            <div
              key={channel.id}
              className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all hover:border-gray-200"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl ${channelBgColors[channel.type]} flex items-center justify-center shrink-0`}
                >
                  <ChannelIcon
                    channel={channel.type}
                    className="!text-2xl"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">
                      {channel.name}
                    </h3>
                    <Badge
                      variant={status.variant as any}
                      className="text-[10px] px-2 py-0.5 gap-1 shrink-0"
                    >
                      {status.icon}
                      {t(`statusLabels.${status.label}`)}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {channel.description}
                  </p>
                  {channel.connectedAt && (
                    <p className="text-[11px] text-gray-400 mt-2">
                      {t("connectedSince")}{" "}
                      {formatDistanceToNow(new Date(channel.connectedAt), {
                        addSuffix: true,
                      })}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-gray-50">
                {channel.status === "connected" ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-xs rounded-lg"
                    >
                      <Settings className="!text-sm" />
                      {t("configure")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-xs rounded-lg text-destructive-500 hover:text-destructive-600"
                    >
                      <Cancel className="!text-sm" />
                      {t("disconnect")}
                    </Button>
                  </>
                ) : (
                  <Button size="sm" className="gap-1.5 text-xs rounded-lg">
                    <Add className="!text-sm" />
                    {t("connect")}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChannelsSettingsPage;
