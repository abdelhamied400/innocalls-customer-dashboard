"use client";
import LinkTabs, { LinkTab } from "@/components/LinkTabs";
import { PropsWithChildren, useEffect } from "react";
import withPermission from "@/containers/withPermission";
import { useLocale, useTranslations } from "@/providers/TranslationProvider";
import useAppStore from "@/store/app.slice";

type UsageLayoutProps = PropsWithChildren<{}>;
const UsageLayout = ({ children }: UsageLayoutProps) => {
  const t = useTranslations("usage");
  const tNav = useTranslations("sidebar.navigation");

  const { setPageTitle } = useAppStore();
  const locale = useLocale();

  useEffect(() => {
    setPageTitle(tNav("usage"));
  }, [locale]);

  return (
    <div className="bg-white rounded-xl p-4 h-auto sm:h-full flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <LinkTabs
          tabs={[
            { label: t("layout.tabs.summary"), href: "/usage/summary" },
            { label: t("layout.tabs.detailed"), href: "/usage/detailed" },
          ]}
        />
      </div>
      <div className="h-[calc(100%-3rem)]">{children}</div>
    </div>
  );
};

export default withPermission(UsageLayout, "fullAccessUsageAnalytics");
