"use client";
import LinkTabs, { LinkTab } from "@/components/LinkTabs";
import { PropsWithChildren } from "react";
import withPermission from "@/containers/withPermission";
import { useTranslations } from "next-intl";

type UsageLayoutProps = PropsWithChildren<{}>;
const UsageLayout = ({ children }: UsageLayoutProps) => {
  const t = useTranslations("usage");

  return (
    <div className="bg-white rounded-xl p-4 h-auto sm:h-full flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <LinkTabs>
          <LinkTab href="/usage/summary">{t("layout.tabs.summary")}</LinkTab>
          <LinkTab href="/usage/detailed">{t("layout.tabs.detailed")}</LinkTab>
        </LinkTabs>
      </div>
      <div className="h-[calc(100%-3rem)]">{children}</div>
    </div>
  );
};

export default withPermission(UsageLayout, "fullAccessUsageAnalytics");
