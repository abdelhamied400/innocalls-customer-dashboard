"use client";
import { useEffect } from "react";
import CallReportingTable from "./table";
import { useTranslations } from "next-intl";
import useAppStore from "@/store/app.slice";

const CallReporting = () => {
  const t = useTranslations("callReporting");
  const { setPageTitle } = useAppStore();

  useEffect(() => {
    setPageTitle(t("title"));
  }, []);
  return (
    <div className="page h-full" id="call-reporting">
      <CallReportingTable />
    </div>
  );
};

export default CallReporting;
