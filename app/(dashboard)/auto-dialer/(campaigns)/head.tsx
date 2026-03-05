"use client";
import LinkTabs, { LinkTab } from "@/components/LinkTabs";
import { useTranslations } from "@/providers/TranslationProvider";

const AutoDialerHead = () => {
  const t = useTranslations("autoDialer");

  return (
    <div className="flex items-center flex-wrap gap-2 auto-dialer-head">
      <LinkTabs>
        <LinkTab href="/auto-dialer/active">{t("tabs.active")}</LinkTab>
        <LinkTab href="/auto-dialer/finished">{t("tabs.finished")}</LinkTab>
        <LinkTab href="/auto-dialer/archived">{t("tabs.archived")}</LinkTab>
      </LinkTabs>
    </div>
  );
};

export default AutoDialerHead;
