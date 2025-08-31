"use client";
import { useEffect } from "react";
import CallReportingTable from "./table";
import { useLocale, useTranslations } from "@/providers/TranslationProvider";
import useAppStore from "@/store/app.slice";

const CallReporting = () => {
  const t = useTranslations("callReporting");
  const { setPageTitle } = useAppStore();
  const locale = useLocale();

  useEffect(() => {
    setPageTitle(t("title"));
  }, [locale]);
  return (
    <div className="page h-full" id="call-reporting">
      <CallReportingTable />
    </div>
  );
};

export default CallReporting;
