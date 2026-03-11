"use client";

import { useTranslations } from "@/providers/TranslationProvider";
import WebCallTable from "./table";
import withActiveOrganization from "@/containers/withActiveOrganization";
import withPermission from "@/containers/withPermission";

const WebCallPage = () => {
  const t = useTranslations("developers.webcall");

  return (
    <div className="page h-full" id="webcall">
      <div className="flex flex-col h-full gap-4">
        <h1 className="text-xl font-semibold">{t("title")}</h1>
        <WebCallTable />
      </div>
    </div>
  );
};

export default withActiveOrganization(
  withPermission(WebCallPage, "completeControlDeveloperTools"),
);
