"use client";
import LinkTabs, { LinkTab } from "@/components/LinkTabs";
import { useTranslations } from "@/providers/TranslationProvider";
import { useParams } from "next/navigation";
import { PropsWithChildren } from "react";

type SurveyDetailsLayoutProps = PropsWithChildren<{}>;
const SurveyDetailsLayout = ({ children }: SurveyDetailsLayoutProps) => {
  const { id } = useParams();
  const t = useTranslations("callSurvey.detailsLayout");

  return (
    <div className="call-survey-details-layout flex flex-col gap-4">
      <LinkTabs>
        <LinkTab href={`/call-survey/${id}/details/metrics`}>
          {t("tabs.metrics")}
        </LinkTab>
        <LinkTab href={`/call-survey/${id}/details/cdrs`}>
          {t("tabs.cdrs")}
        </LinkTab>
        <LinkTab href={`/call-survey/${id}/details`} exact>
          {t("tabs.details")}
        </LinkTab>
      </LinkTabs>

      <div className="bg-white rounded-lg p-4">{children}</div>
    </div>
  );
};

export default SurveyDetailsLayout;
