"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "@/providers/TranslationProvider";
import { ArrowBack } from "@mui/icons-material";
import Link from "next/link";
import { use } from "react";

type HistoryPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const HistoryPage = ({ params }: HistoryPageProps) => {
  const { id } = use(params);
  const t = useTranslations("reports.scheduled");

  return (
    <div className="page h-full" id="scheduled-report-history">
      <div className="flex flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/reports/scheduled">
              <ArrowBack />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{t("history.title")}</h1>
            <p className="text-muted-foreground">
              {t("history.description")} - Report ID: {id}
            </p>
          </div>
        </div>

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
