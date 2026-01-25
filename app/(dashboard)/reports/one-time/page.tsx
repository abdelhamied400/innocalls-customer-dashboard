"use client";

import { useTranslations } from "@/providers/TranslationProvider";

const OneTimeReportPage = () => {
  const t = useTranslations("reports.oneTime");

  return (
    <div className="page h-full" id="one-time-report">
      <h1>{t("title")}</h1>
    </div>
  );
};

export default OneTimeReportPage;
