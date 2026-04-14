"use client";

import { useEffect } from "react";
import { useLocale, useTranslations } from "@/providers/TranslationProvider";
import useAppStore from "@/store/app.slice";
import withActiveOrganization from "@/containers/withActiveOrganization";

const OmnichannelLayout = ({ children }: { children: React.ReactNode }) => {
  const { setPageTitle } = useAppStore();
  const t = useTranslations("omnichannel");
  const locale = useLocale();

  useEffect(() => {
    setPageTitle(t("pageTitle"));
    return () => setPageTitle(null);
  }, [locale]);

  return (
    <div className="page" id="omnichannel">
      {children}
    </div>
  );
};

export default withActiveOrganization(OmnichannelLayout);
