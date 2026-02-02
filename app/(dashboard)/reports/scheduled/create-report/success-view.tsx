"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "@/providers/TranslationProvider";
import Image from "next/image";
import Link from "next/link";
import { SuccessViewProps } from "./types";

const SuccessView = ({ onBackToReports }: SuccessViewProps) => {
  const t = useTranslations("reports.scheduled.createReport");

  return (
    <div className="p-8 rounded-xl bg-white flex flex-col items-center justify-center gap-4 text-center">
      <Image
        src="/assets/icons/report-generated.svg"
        alt="Report Generated"
        width={80}
        height={80}
      />
      <h2 className="text-xl font-semibold">{t("success.title")}</h2>
      <p className="text-muted-foreground">{t("success.subtitle")}</p>
      <div className="flex flex-col gap-2 w-full mt-4">
        <Button className="w-full" size="lg" onClick={onBackToReports}>
          {t("success.backToReports")}
        </Button>
        <Button asChild variant="link" className="w-full" size="lg">
          <Link href="/">{t("success.backToDashboard")}</Link>
        </Button>
      </div>
    </div>
  );
};

export default SuccessView;
