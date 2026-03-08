"use client";

import { useTranslations } from "@/providers/TranslationProvider";
import ApiCredentialsTable from "./table";
import withActiveOrganization from "@/containers/withActiveOrganization";

const ApiCredentialsPage = () => {
  const t = useTranslations("developers.apiCredentials");

  return (
    <div className="page h-full" id="api-credentials">
      <div className="flex flex-col h-full gap-4">
        <h1 className="text-xl font-semibold">{t("title")}</h1>
        <ApiCredentialsTable />
      </div>
    </div>
  );
};

export default withActiveOrganization(ApiCredentialsPage);
