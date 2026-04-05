"use client";
import LinkTabs, { LinkTab } from "@/components/LinkTabs";
import { useTranslations } from "@/providers/TranslationProvider";
import { useParams } from "next/navigation";
import { PropsWithChildren } from "react";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import callSurveyService from "@/services/call-survey.service";
import SurveyActions from "./SurveyActions";

const TERMINAL_STATUSES = ["finished", "cancelled", "completed"];

type SurveyDetailsLayoutProps = PropsWithChildren<{}>;
const SurveyDetailsLayout = ({ children }: SurveyDetailsLayoutProps) => {
  const { id } = useParams();
  const t = useTranslations("callSurvey.detailsLayout");

  const { data: survey } = useLocalizedQuery({
    queryKey: ["call-survey-detail", id],
    queryFn: () => callSurveyService.getSurvey(id as string),
  });

  const isTerminal = survey
    ? TERMINAL_STATUSES.includes(survey.status)
    : false;

  return (
    <div className="call-survey-details-layout flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <LinkTabs>
          {isTerminal ? (
            <LinkTab href={`/call-survey/${id}/details/analytics`}>
              {t("tabs.analytics")}
            </LinkTab>
          ) : (
            <LinkTab href={`/call-survey/${id}/details/metrics`}>
              {t("tabs.metrics")}
            </LinkTab>
          )}
          <LinkTab href={`/call-survey/${id}/details/cdrs`}>
            {t("tabs.cdrs")}
          </LinkTab>
          <LinkTab href={`/call-survey/${id}/details`} exact>
            {t("tabs.details")}
          </LinkTab>
        </LinkTabs>

        {survey && (
          <SurveyActions
            surveyId={survey.id}
            status={survey.status}
            isDraft={survey.isDraft}
          />
        )}
      </div>

      <div className="bg-white rounded-lg p-4">{children}</div>
    </div>
  );
};

export default SurveyDetailsLayout;
