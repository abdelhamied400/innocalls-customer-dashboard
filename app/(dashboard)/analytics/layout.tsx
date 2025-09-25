"use client";
import LinkTabs, { LinkTab } from "@/components/LinkTabs";
import hasTenant from "@/containers/hasTenant";
import { useTranslations } from "@/providers/TranslationProvider";

const AnalyticsLayout = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("analytics");

  return (
    <div className="h-full w-full">
      <div className="bg-white p-4 rounded-lg">
        <div className="flex flex-col gap-2">
          <LinkTabs>
            <LinkTab href="/analytics/inbound">
              {t("layout.tabs.inbound")}
            </LinkTab>
            <LinkTab href="/analytics/outbound">
              {t("layout.tabs.outbound")}
            </LinkTab>
            <LinkTab href="/analytics/unanswered">
              {t("layout.tabs.unanswered")}
            </LinkTab>
            <LinkTab href="/analytics/user-activity">
              {t("layout.tabs.userActivity")}
            </LinkTab>
          </LinkTabs>
          {children}
        </div>
      </div>
    </div>
  );
};

export default hasTenant(AnalyticsLayout);
