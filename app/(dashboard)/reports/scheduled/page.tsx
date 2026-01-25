"use client";

import { useTranslations } from "@/providers/TranslationProvider";

const ScheduledReportPage = () => {
  const t = useTranslations("reports.scheduled");

  return (
    <div className="page h-full" id="scheduled-report">
      <h1>{t("title")}</h1>
    </div>
  );
};

export default ScheduledReportPage;
