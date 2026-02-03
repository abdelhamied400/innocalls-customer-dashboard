"use client";

import { useTranslations } from "@/providers/TranslationProvider";

const HistoryPage = () => {
  const t = useTranslations("reports.scheduled");

  return (
    <div className="page h-full" id="scheduled-report-history">
      <div className="flex flex-col gap-6 p-6">
        {/* History Content Placeholder */}
        <div className="rounded-lg border bg-card p-6">
          <p className="text-muted-foreground text-center py-8">
            {t("history.noHistory")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
