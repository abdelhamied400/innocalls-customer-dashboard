"use client";

import LinkTabs, { LinkTab } from "@/components/LinkTabs";
import { useTranslations } from "@/providers/TranslationProvider";
import { PropsWithChildren } from "react";

type CallSurveyLayoutProps = PropsWithChildren<{}>;
const CallSurveyLayout = ({ children }: CallSurveyLayoutProps) => {
  const t = useTranslations("callSurvey");

  return (
    <div className="call-survey-layout bg-white rounded-xl p-4 h-auto sm:h-full flex flex-col gap-2">
      <LinkTabs>
        <LinkTab href="/call-survey/active" exact>
          {t("tabs.active")}
        </LinkTab>
        <LinkTab href="/call-survey/finished">
          {t("tabs.finished")}
        </LinkTab>
      </LinkTabs>

      <div className="h-[calc(100%-3rem)] overflow-auto">{children}</div>
    </div>
  );
};

export default CallSurveyLayout;
