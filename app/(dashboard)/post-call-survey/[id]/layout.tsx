"use client";

import LinkTabs, { LinkTab } from "@/components/LinkTabs";
import { useTranslations } from "@/providers/TranslationProvider";
import { useParams } from "next/navigation";
import { PropsWithChildren } from "react";

type PostCallSurveyDetailLayoutProps = PropsWithChildren<{}>;

const PostCallSurveyDetailLayout = ({
  children,
}: PostCallSurveyDetailLayoutProps) => {
  const { id } = useParams();
  const t = useTranslations("postCallSurvey.detailsLayout");

  return (
    <div className="post-call-survey-details-layout flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <LinkTabs>
          <LinkTab href={`/post-call-survey/${id}/details`} exact>
            {t("tabs.details")}
          </LinkTab>
          <LinkTab href={`/post-call-survey/${id}/cdrs`}>
            {t("tabs.cdrs")}
          </LinkTab>
          <LinkTab href={`/post-call-survey/${id}/call-analytics`} disabled>
            {t("tabs.analytics")}
          </LinkTab>
        </LinkTabs>
      </div>

      <div>{children}</div>
    </div>
  );
};

export default PostCallSurveyDetailLayout;
