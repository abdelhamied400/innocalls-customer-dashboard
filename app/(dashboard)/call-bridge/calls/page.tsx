"use client";
import withPermission from "@/containers/withPermission";
import { useLocale, useTranslations } from "@/providers/TranslationProvider";
import useAppStore from "@/store/app.slice";
import { useEffect } from "react";
import CallBridgeCallsTable from "./table";

const CallBridgeCallsPage = () => {
  const { setPageTitle } = useAppStore();
  const t = useTranslations("callBridge.calls");
  const locale = useLocale();

  useEffect(() => {
    setPageTitle(t("title"));
  }, [locale]);

  return (
    <div className="page flex-1 overflow-hidden" id="call-bridge-calls">
      <div className="border rounded-xl h-full flex flex-col overflow-hidden bg-white">
        <CallBridgeCallsTable />
      </div>
    </div>
  );
};

export default withPermission(
  CallBridgeCallsPage,
  "fullAccessConferenceBridge",
);
