"use client";

import LinkTabs, { LinkTab } from "@/components/LinkTabs";
import { useTranslations } from "@/providers/TranslationProvider";
import { PropsWithChildren } from "react";

type CallBridgeLayoutProps = PropsWithChildren<{}>;
const CallBridgeLayout = ({ children }: CallBridgeLayoutProps) => {
  const t = useTranslations("callBridge");

  return (
    <div className="call-bridge-layout bg-white rounded-xl p-4 h-auto sm:h-full flex flex-col gap-2">
      <LinkTabs>
        <LinkTab href="/call-bridge" exact>
          {t("list.title")}
        </LinkTab>
        <LinkTab href="/call-bridge/calls">{t("list.calls")}</LinkTab>
      </LinkTabs>

      <div className="h-[calc(100%-3rem)]">{children}</div>
    </div>
  );
};

export default CallBridgeLayout;
