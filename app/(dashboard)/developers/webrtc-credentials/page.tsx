"use client";

import { useTranslations } from "@/providers/TranslationProvider";
import WebrtcCredentialsTable from "./table";
import withActiveOrganization from "@/containers/withActiveOrganization";
import withPermission from "@/containers/withPermission";

const WebrtcCredentialsPage = () => {
  const t = useTranslations("developers.webrtc");

  return (
    <div className="page h-full" id="webrtc-credentials">
      <div className="flex flex-col h-full gap-4">
        <h1 className="text-xl font-semibold">{t("title")}</h1>
        <WebrtcCredentialsTable />
      </div>
    </div>
  );
};

export default withActiveOrganization(
  withPermission(WebrtcCredentialsPage, "completeControlDeveloperTools"),
);
