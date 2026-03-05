"use client";

import { useTranslations } from "@/providers/TranslationProvider";
import ZohoCredentialsTable from "./table";
import withActiveOrganization from "@/containers/withActiveOrganization";

const ZohoCredentialsPage = () => {
  const t = useTranslations("developers.zoho");

  return (
    <div className="page h-full" id="zoho-credentials">
      <div className="flex flex-col h-full gap-4">
        <h1 className="text-xl font-semibold">{t("title")}</h1>
        <ZohoCredentialsTable />
      </div>
    </div>
  );
};

export default withActiveOrganization(ZohoCredentialsPage);
