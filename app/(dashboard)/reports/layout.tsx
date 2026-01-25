"use client";

import LinkTabs, { LinkTab } from "@/components/LinkTabs";
import hasTenant from "@/containers/hasTenant";
import { useLocale, useTranslations } from "@/providers/TranslationProvider";
import useAppStore from "@/store/app.slice";
import { useEffect } from "react";

const ReportsLayout = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("reports");
  const { setPageTitle } = useAppStore();
  const locale = useLocale();

  useEffect(() => {
    setPageTitle(t("title"));

    return () => setPageTitle(null);
  }, [locale]);

  return (
    <div className="h-full w-full">
      <div className="bg-white p-4 rounded-lg h-full">
        <div className="flex flex-col gap-2 h-full">
          <LinkTabs>
            <LinkTab href="/reports/one-time">
              {t("layout.tabs.oneTime")}
            </LinkTab>
            <LinkTab href="/reports/scheduled">
              {t("layout.tabs.scheduled")}
            </LinkTab>
          </LinkTabs>

          <hr />

          {children}
        </div>
      </div>
    </div>
  );
};

export default hasTenant(ReportsLayout);
