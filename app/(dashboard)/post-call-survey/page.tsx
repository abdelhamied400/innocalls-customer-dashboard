"use client";

import withActiveOrganization from "@/containers/withActiveOrganization";
import PostCallSurveyTable from "./table";
import useAppStore from "@/store/app.slice";
import { useTranslations } from "@/providers/TranslationProvider";
import { useEffect } from "react";

const PostCallSurveyPage = () => {
  const { setPageTitle } = useAppStore();
  const t = useTranslations("sidebar");

  useEffect(() => {
    setPageTitle(t("navigation.postCallSurvey"));
  }, []);

  return (
    <div className="bg-white rounded-xl p-4 h-full" id="post-call-survey">
      <div className="border rounded-xl h-full flex flex-col overflow-hidden">
        <PostCallSurveyTable />
      </div>
    </div>
  );
};

export default withActiveOrganization(PostCallSurveyPage);
