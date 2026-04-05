"use client";
import { useTranslations } from "@/providers/TranslationProvider";
import useAppStore from "@/store/app.slice";
import { useEffect } from "react";
import CallSurveyFinishedTable from "./table";

const FinishedCallSurveys = () => {
  const { setPageTitle } = useAppStore();
  const t = useTranslations("sidebar");

  useEffect(() => {
    setPageTitle(t("navigation.callSurvey"));
  }, []);

  return (
    <div className="page flex-1 overflow-hidden" id="call-survey-finished">
      <div className="border rounded-xl h-full flex flex-col overflow-hidden">
        <CallSurveyFinishedTable />
      </div>
    </div>
  );
};

export default FinishedCallSurveys;
