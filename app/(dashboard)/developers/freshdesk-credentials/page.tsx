"use client";

import { useTranslations } from "@/providers/TranslationProvider";
import FreshdeskCredentialsTable from "./table";
import withActiveOrganization from "@/containers/withActiveOrganization";
import withPermission from "@/containers/withPermission";

const FreshdeskCredentialsPage = () => {
  const t = useTranslations("developers.freshdesk");

  return (
    <div className="page h-full" id="freshdesk-credentials">
      <div className="flex flex-col h-full gap-4">
        <h1 className="text-xl font-semibold">{t("title")}</h1>
        <FreshdeskCredentialsTable />
      </div>
    </div>
  );
};

export default withActiveOrganization(
  withPermission(FreshdeskCredentialsPage, "completeControlDeveloperTools"),
);
