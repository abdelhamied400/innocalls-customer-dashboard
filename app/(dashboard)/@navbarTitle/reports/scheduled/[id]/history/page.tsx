"use client";

import { useTranslations } from "@/providers/TranslationProvider";
import { ArrowBackIos } from "@mui/icons-material";
import Link from "next/link";
import { use } from "react";

type HistoryNavbarTitleProps = {
  params: Promise<{
    id: string;
  }>;
};

const HistoryNavbarTitle = ({ params }: HistoryNavbarTitleProps) => {
  const { id } = use(params);
  const t = useTranslations("reports.scheduled");

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/reports/scheduled"
        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
      >
        <ArrowBackIos className="text-gray-600 rtl:rotate-180 text-sm" />
      </Link>
      <div className="flex flex-col">
        <h1 className="text-lg font-semibold leading-tight">
          {t("history.title")}
        </h1>
        <span className="text-sm text-muted-foreground">Report ID: {id}</span>
      </div>
    </div>
  );
};

export default HistoryNavbarTitle;
