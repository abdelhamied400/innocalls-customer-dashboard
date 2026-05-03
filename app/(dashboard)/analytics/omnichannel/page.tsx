"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "@/providers/TranslationProvider";
import omnichannelService from "@/services/omnichannel.service";
import type { OmnichannelStats, ChannelType } from "@/types/omnichannel";
import StatsCard from "@/components/StatsCard";
import ChannelIcon, {
  channelLabels,
} from "@/components/omnichannel/ChannelIcon";
import {
  Forum,
  HourglassEmpty,
  CheckCircle,
  QuestionAnswer,
  AccessTime,
} from "@mui/icons-material";

const OmnichannelAnalyticsPage = () => {
  const t = useTranslations("omnichannel.analytics");
  const [stats, setStats] = useState<OmnichannelStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    omnichannelService.getStats().then((data) => {
      setStats(data);
      setIsLoading(false);
    });
  }, []);

  const channels: ChannelType[] = [
    "whatsapp",
    "live_chat",
    "messenger",
    "x",
    "instagram",
    "telegram",
  ];

  return (
    <div className="flex flex-col gap-6 py-4">
      {/* Overview Stats */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          {t("overview")}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatsCard
            icon={<QuestionAnswer />}
            title={t("totalConversations")}
            value={stats?.totalConversations ?? 0}
            color="primary"
            isLoading={isLoading}
          />
          <StatsCard
            icon={<Forum />}
            title={t("active")}
            value={stats?.activeConversations ?? 0}
            color="success"
            isLoading={isLoading}
          />
          <StatsCard
            icon={<HourglassEmpty />}
            title={t("waiting")}
            value={stats?.waitingConversations ?? 0}
            color="warning"
            isLoading={isLoading}
          />
          <StatsCard
            icon={<CheckCircle />}
            title={t("resolvedToday")}
            value={stats?.resolvedToday ?? 0}
            color="info"
            isLoading={isLoading}
          />
          <StatsCard
            icon={<AccessTime />}
            title={t("avgResponseTime")}
            value={stats?.avgResponseTime ?? "-"}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Channel Breakdown */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          {t("byChannel")}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {channels.map((ch) => (
            <div
              key={ch}
              className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3.5 hover:shadow-sm transition-shadow"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                <ChannelIcon channel={ch} className="!text-xl" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{channelLabels[ch]}</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats?.channelBreakdown[ch] ?? 0}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OmnichannelAnalyticsPage;
