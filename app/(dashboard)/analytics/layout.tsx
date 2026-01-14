"use client";
import LinkTabs, { LinkTab } from "@/components/LinkTabs";
import hasTenant from "@/containers/hasTenant";
import useAuth from "@/hooks/useAuth";
import { useLocale, useTranslations } from "@/providers/TranslationProvider";
import useAppStore from "@/store/app.slice";
import {
  ArrowDownward,
  ArrowUpward,
  CallMissedOutgoing,
  History,
  SupervisedUserCircle,
} from "@mui/icons-material";
import { useEffect } from "react";

const AnalyticsLayout = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("analytics");
  const { data: auth } = useAuth();
  const { setPageTitle } = useAppStore();
  const locale = useLocale();

  useEffect(() => {
    setPageTitle(t("title"));

    // Cleanup when component unmounts
    return () => setPageTitle(null);
  }, [locale]);

  return (
    <div className="h-full w-full">
      <div className="bg-white p-4 rounded-lg">
        <div className="flex flex-col gap-2">
          <LinkTabs>
            <LinkTab href="/analytics/inbound">
              <ArrowDownward />
              {t("layout.tabs.inbound")}
            </LinkTab>
            <LinkTab href="/analytics/outbound">
              <ArrowUpward />
              {t("layout.tabs.outbound")}
            </LinkTab>
            <LinkTab href="/analytics/unanswered">
              <CallMissedOutgoing />
              {t("layout.tabs.unanswered")}
            </LinkTab>
            {auth?.user?.agentsAccessControl && (
              <LinkTab href="/analytics/agents-performance">
                <SupervisedUserCircle />
                {t("layout.tabs.userActivity")}
              </LinkTab>
            )}
            <LinkTab href="/analytics/call-reporting">
              <History />
              {t("layout.tabs.callReporting")}
            </LinkTab>
          </LinkTabs>

          <hr />

          {children}
        </div>
      </div>
    </div>
  );
};

export default hasTenant(AnalyticsLayout);
