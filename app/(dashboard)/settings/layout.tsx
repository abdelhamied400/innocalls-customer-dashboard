"use client";
import LinkTabs, { LinkTab } from "@/components/LinkTabs";
import { useTranslations } from "@/providers/TranslationProvider";
import { PropsWithChildren } from "react";

type SettingsLayoutProps = PropsWithChildren<{}>;
const SettingsLayout = ({ children }: SettingsLayoutProps) => {
  const t = useTranslations("settings.layout.tabs");

  return (
    <div className="layout h-full relative" id="settings-layout">
      <div className="bg-white h-full p-4 rounded-lg">
        <div className="flex flex-col h-full gap-2">
          <div className="bg-white sticky -top-4 z-10 p-4 rounded-lg">
            <LinkTabs>
              <LinkTab href="/settings/account">{t("account")}</LinkTab>
              <LinkTab href="/settings/call">{t("call")}</LinkTab>
              <LinkTab href="/settings/agent">{t("agent")}</LinkTab>
            </LinkTabs>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
