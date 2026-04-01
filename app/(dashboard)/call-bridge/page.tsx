"use client";
import withPermission from "@/containers/withPermission";
import { useTranslations } from "@/providers/TranslationProvider";
import useAppStore from "@/store/app.slice";
import { useEffect } from "react";
import CallBridgeTable from "./table";
import withActiveOrganization from "@/containers/withActiveOrganization";

const CallBridgeList = () => {
  const { setPageTitle } = useAppStore();
  const t = useTranslations("sidebar");

  useEffect(() => {
    setPageTitle(t("navigation.callBridge"));
  }, []);

  return (
    <div className="page flex-1 overflow-hidden" id="call-bridge">
      <div className="border rounded-xl h-full flex flex-col overflow-hidden">
        <CallBridgeTable />
      </div>
    </div>
  );
};

export default withActiveOrganization(
  withPermission(CallBridgeList, "fullAccessConferenceBridge"),
);
