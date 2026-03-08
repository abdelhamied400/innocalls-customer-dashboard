"use client";

import { useTranslations } from "@/providers/TranslationProvider";
import ZendeskCredentialsTable from "./table";
import withActiveOrganization from "@/containers/withActiveOrganization";
import withPermission from "@/containers/withPermission";

const ZendeskCredentialsPage = () => {
  const t = useTranslations("developers.zendesk");

  return (
    <div className="page h-full" id="zendesk-credentials">
      <div className="flex flex-col h-full gap-4">
        <h1 className="text-xl font-semibold">{t("title")}</h1>
        <ZendeskCredentialsTable />
      </div>
    </div>
  );
};

export default withActiveOrganization(
  withPermission(ZendeskCredentialsPage, "completeControlDeveloperTools"),
);
