"use client";
import { useTranslations } from "@/providers/TranslationProvider";
import useAppStore from "@/store/app.slice";
import { useEffect } from "react";
import CallSurveyActiveTable from "./table";

const ActiveCallSurveys = () => {
  const { setPageTitle } = useAppStore();
  const t = useTranslations("sidebar");

  useEffect(() => {
    setPageTitle(t("navigation.callSurvey"));
  }, []);

  return (
    <div className="page flex-1 overflow-hidden" id="call-survey">
      <div className="border rounded-xl h-full flex flex-col overflow-hidden">
        <CallSurveyActiveTable />
      </div>
    </div>
  );
};

export default ActiveCallSurveys;
