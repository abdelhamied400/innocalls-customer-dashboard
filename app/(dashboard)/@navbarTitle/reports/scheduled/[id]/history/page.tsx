"use client";

import Breadcrumbs, { BreadcrumbItem } from "@/components/Breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/providers/TranslationProvider";
import scheduledReportsService from "@/services/scheduled-reports.service";
import { ArrowBackIos } from "@mui/icons-material";
import Link from "next/link";
import { use } from "react";

type HistoryNavbarTitleProps = {
  params: Promise<{
    id: string;
  }>;
};

const classMap: Record<string, string> = {
  daily: "bg-info-200 text-info-500",
  weekly: "bg-[#DFD6F1] text-[#44157D]",
  monthly: "bg-[#D7EEF7] text-[#2021AD]",
};

const HistoryNavbarTitle = ({ params }: HistoryNavbarTitleProps) => {
  const { id } = use(params);
  const t = useTranslations("reports.scheduled");

  const { data: report } = useLocalizedQuery({
    queryKey: ["scheduled-report", id],
    queryFn: () => scheduledReportsService.fetchById(id),
  });

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: t("title"),
      href: "/reports/scheduled",
    },
    {
      label: report?.name || "...",
      disabled: true,
    },
  ];

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/reports/scheduled"
        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
      >
        <ArrowBackIos
          className="text-gray-600 rtl:rotate-180"
          sx={{ fontSize: 12 }}
        />
      </Link>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold leading-tight">
            {report?.name || t("history.title")}
          </h1>
          {report?.frequency && (
            <Badge
              className={cn("rounded-lg border-0", classMap[report.frequency])}
            >
              {t(`cells.scheduled.${report.frequency}`)}
            </Badge>
          )}
          {report?.status && (
            <Badge
              variant={report.status === "active" ? "success" : "destructive"}
            >
              {t(`cells.status.${report.status}`)}
            </Badge>
          )}
        </div>
        <Breadcrumbs items={breadcrumbItems} />
      </div>
    </div>
  );
};

export default HistoryNavbarTitle;
