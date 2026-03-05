"use client";
import LinkTabs, { LinkTab } from "@/components/LinkTabs";
import { useTranslations } from "@/providers/TranslationProvider";
import useAppStore from "@/store/app.slice";
import { PropsWithChildren, useEffect } from "react";

const AgentAutoDialerLayout = ({ children }: PropsWithChildren) => {
  const t = useTranslations("autoDialerAgent");
  const st = useTranslations("sidebar");
  const { setPageTitle } = useAppStore();

  useEffect(() => {
    setPageTitle(st("navigation.autoDialer"));
  }, []);

  return (
    <div className="page flex flex-col gap-4 flex-1 p-4 rounded-xl overflow-hidden bg-white">
      <LinkTabs>
        <LinkTab href="/auto-dialer/active">{t("tabs.active")}</LinkTab>
        <LinkTab href="/auto-dialer/finished">{t("tabs.finished")}</LinkTab>
      </LinkTabs>
      <div className="border rounded-xl flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default AgentAutoDialerLayout;
