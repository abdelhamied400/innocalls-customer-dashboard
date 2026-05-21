"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "@/providers/TranslationProvider";
import omnichannelService from "@/services/omnichannel.service";
import type {
  Channel,
  ChannelType,
  OmnichannelStats,
} from "@/types/omnichannel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ChannelIcon, {
  channelLabels,
} from "@/components/omnichannel/ChannelIcon";
import ChannelSetupDialog from "@/components/omnichannel/dialogs";
import {
  Settings,
  LinkOff,
  Add,
  HourglassEmpty,
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

const allChannelTypes: ChannelType[] = [
  "whatsapp",
  "live_chat",
  "messenger",
  "x",
  "instagram",
  "telegram",
];

const channelDescriptions: Record<ChannelType, string> = {
  whatsapp: "WhatsApp Business API integration",
  live_chat: "Embedded website chat widget",
  messenger: "Facebook Messenger integration",
  x: "X (Twitter) direct messages",
  instagram: "Instagram direct messages",
  telegram: "Telegram bot integration",
};

const channelTints: Record<
  ChannelType,
  {
    soft: string;
    card: string;
    icon: string;
    border: string;
    divider: string;
    text: string;
    button: string;
  }
> = {
  whatsapp: {
    soft: "bg-green-50",
    card: "bg-green-50",
    icon: "bg-green-100",
    border: "border-green-200",
    divider: "border-green-200/70",
    text: "text-green-700",
    button:
      "bg-green-100 text-green-700 border border-green-300 hover:bg-green-200 hover:text-green-800 hover:border-green-400",
  },
  live_chat: {
    soft: "bg-purple-50",
    card: "bg-purple-50",
    icon: "bg-purple-100",
    border: "border-purple-200",
    divider: "border-purple-200/70",
    text: "text-purple-700",
    button:
      "bg-purple-100 text-purple-700 border border-purple-300 hover:bg-purple-200 hover:text-purple-800 hover:border-purple-400",
  },
  messenger: {
    soft: "bg-blue-50",
    card: "bg-blue-50",
    icon: "bg-blue-100",
    border: "border-blue-200",
    divider: "border-blue-200/70",
    text: "text-blue-700",
    button:
      "bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200 hover:text-blue-800 hover:border-blue-400",
  },
  x: {
    soft: "bg-gray-100",
    card: "bg-gray-100",
    icon: "bg-white",
    border: "border-gray-200",
    divider: "border-gray-300/60",
    text: "text-gray-900",
    button:
      "bg-white text-gray-900 border border-gray-400 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-500",
  },
  instagram: {
    soft: "bg-pink-50",
    card: "bg-pink-50",
    icon: "bg-pink-100",
    border: "border-pink-200",
    divider: "border-pink-200/70",
    text: "text-pink-700",
    button:
      "bg-pink-100 text-pink-700 border border-pink-300 hover:bg-pink-200 hover:text-pink-800 hover:border-pink-400",
  },
  telegram: {
    soft: "bg-sky-50",
    card: "bg-sky-50",
    icon: "bg-sky-100",
    border: "border-sky-200",
    divider: "border-sky-200/70",
    text: "text-sky-700",
    button:
      "bg-sky-100 text-sky-700 border border-sky-300 hover:bg-sky-200 hover:text-sky-800 hover:border-sky-400",
  },
};

function getConnectedAccountLabel(channel: Channel | null): string | null {
  if (!channel || channel.status !== "connected") return null;
  const cfg = (channel.config ?? {}) as Record<string, unknown>;
  switch (channel.type) {
    case "x": {
      const username = cfg.username as string | undefined;
      return username ? `@${username}` : null;
    }
    case "instagram": {
      const igName = cfg.username as string | undefined;
      return igName ? `@${igName}` : null;
    }
    case "telegram": {
      const botUsername = cfg.botUsername as string | undefined;
      return botUsername ? `@${botUsername}` : null;
    }
    case "messenger":
    case "whatsapp":
      return channel.name || null;
    default:
      return null;
  }
}

/** Maps a "last activity" timestamp to a coarse health bucket — the dot
 * color is a glanceable proxy for "is this channel alive?" without
 * needing real uptime telemetry. */
function healthFromLastActivity(
  ts: string | null,
): { color: string; label: string; pulse: boolean; description: string } {
  if (!ts)
    return {
      color: "bg-gray-300",
      label: "Idle",
      pulse: false,
      description: "No activity yet on this channel.",
    };
  const ageMs = Date.now() - new Date(ts).getTime();
  const hours = ageMs / (1000 * 60 * 60);
  if (hours < 1)
    return {
      color: "bg-green-500",
      label: "Live",
      pulse: true,
      description: "Activity within the last hour.",
    };
  if (hours < 24)
    return {
      color: "bg-green-400",
      label: "Active",
      pulse: false,
      description: "Activity within the last 24 hours.",
    };
  if (hours < 24 * 7)
    return {
      color: "bg-amber-400",
      label: "Quiet",
      pulse: false,
      description: "Activity within the last 7 days.",
    };
  return {
    color: "bg-gray-300",
    label: "Idle",
    pulse: false,
    description: "No activity in over a week.",
  };
}

const ChannelsSettingsPage = () => {
  const t = useTranslations("omnichannel.channels");
  const [connectedChannels, setConnectedChannels] = useState<Channel[]>([]);
  const [stats, setStats] = useState<OmnichannelStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadAll = () => {
    Promise.all([
      omnichannelService.getChannels(),
      omnichannelService.getStats().catch(() => null),
    ])
      .then(([channels, s]) => {
        setConnectedChannels(channels);
        setStats(s);
        setIsLoading(false);
      })
      .catch(() => {
        setConnectedChannels([]);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadAll();
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
      <div className="flex flex-col gap-5 p-4 w-full">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="flex flex-col gap-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const connected = allChannelTypes
    .map((type) => ({ type, channel: getChannelData(type) }))
    .filter(
      (x) =>
        x.channel?.status === "connected" || x.channel?.status === "pending",
    );
  const available = allChannelTypes
    .map((type) => ({ type, channel: getChannelData(type) }))
    .filter(
      (x) =>
        !x.channel ||
        (x.channel.status !== "connected" && x.channel.status !== "pending"),
    );

  return (
    <TooltipProvider delayDuration={150}>
    <div className="flex flex-col gap-6 p-4 w-full">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
          {t("title")}
        </h2>
        <p className="text-sm text-gray-500">{t("subtitle")}</p>
      </div>

      {/* Connected channels — clean cards with identity + status */}
      {connected.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2 px-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              {t("sectionConnected") || "Connected"}
            </h3>
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-gray-100 text-[10px] font-semibold text-gray-600">
              {connected.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {connected.map(({ type, channel }) => {
              if (!channel) return null;
              const tint = channelTints[type];
              const isPending = channel.status === "pending";
              const accountLabel = getConnectedAccountLabel(channel);
              const lastActivityAt =
                stats?.lastActivityByChannel?.[type] ?? null;
              const health = healthFromLastActivity(lastActivityAt);

              return (
                <div
                  key={type}
                  className={cn(
                    "flex flex-col rounded-xl border p-4 transition-all hover:shadow-sm",
                    tint.card,
                    tint.border,
                  )}
                >
                  {/* Header row: icon + name + status pill */}
                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                        tint.icon,
                      )}
                    >
                      <ChannelIcon channel={type} className="!text-xl" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold text-sm text-gray-900 truncate">
                          {channelLabels[type]}
                        </h3>
                        {/* Health pill — small, top-right, with pulse for live */}
                        {isPending ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-600 shrink-0">
                            <HourglassEmpty className="!text-[11px]" />
                            {t("statusLabels.pending")}
                          </span>
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span
                                tabIndex={0}
                                className="inline-flex items-center gap-1.5 text-[10px] font-medium text-gray-500 shrink-0 cursor-help"
                              >
                                <span className="relative flex h-2 w-2">
                                  {health.pulse && (
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
                                  )}
                                  <span
                                    className={cn(
                                      "relative inline-flex rounded-full h-2 w-2",
                                      health.color,
                                    )}
                                  />
                                </span>
                                {health.label}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="max-w-[220px] bg-white text-gray-700 ring-1 ring-gray-200 shadow-md font-normal text-[11px] px-3 py-2 leading-snug"
                            >
                              <p className="font-semibold text-gray-900 mb-0.5">
                                {health.label}
                              </p>
                              <p className="text-gray-500">
                                {health.description}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      {accountLabel && (
                        <p
                          className={cn(
                            "text-[12px] font-medium mt-0.5 truncate",
                            tint.text,
                          )}
                        >
                          {accountLabel}
                        </p>
                      )}
                      {channel.connectedAt && (
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {t("connectedSince")}{" "}
                          {formatDistanceToNow(new Date(channel.connectedAt), {
                            addSuffix: true,
                          })}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions row — pinned to bottom so 2-line and 3-line
                      cards in the same grid row align their buttons. The
                      mb-4 on the header above guarantees breathing room
                      between the content and the divider on tall cards. */}
                  <div
                    className={cn(
                      "flex items-center justify-end gap-1 mt-auto pt-3 border-t",
                      tint.divider,
                    )}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 text-xs rounded-lg text-destructive-500 hover:text-destructive-600 hover:bg-red-50"
                      onClick={async () => {
                        await omnichannelService.deleteChannel(channel.id);
                        loadAll();
                      }}
                    >
                      <LinkOff className="!text-sm" />
                      {t("disconnect")}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "gap-1.5 text-xs rounded-lg",
                        tint.button,
                      )}
                      onClick={() => handleConfigure(channel)}
                    >
                      <Settings className="!text-sm" />
                      {t("configure")}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Available channels — compact tiles */}
      {available.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2 px-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              {t("sectionAvailable") || "Available"}
            </h3>
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-gray-100 text-[10px] font-semibold text-gray-600">
              {available.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {available.map(({ type }) => {
              const tint = channelTints[type];
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleConnect(type)}
                  className="group relative bg-white rounded-xl border border-dashed border-gray-200 p-4 text-start transition-all hover:border-primary-300 hover:bg-primary-50/30 hover:shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                        tint.soft,
                      )}
                    >
                      <ChannelIcon channel={type} className="!text-xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-gray-900 truncate">
                        {channelLabels[type]}
                      </h3>
                      <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">
                        {channelDescriptions[type]}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-1 mt-3 text-[11px] font-medium text-gray-500 group-hover:text-primary-600 transition-colors">
                    <Add className="!text-[14px]" />
                    {t("connect")}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      <ChannelSetupDialog
        channel={selectedChannel}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSaved={loadAll}
      />
    </div>
    </TooltipProvider>
  );
};

export default ChannelsSettingsPage;
