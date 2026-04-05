"use client";
import Breadcrumbs, { BreadcrumbItem } from "@/components/Breadcrumbs";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { useTranslations } from "@/providers/TranslationProvider";
import callSurveyService from "@/services/call-survey.service";
import { ArrowBackIos } from "@mui/icons-material";
import Link from "next/link";
import { use } from "react";

const statusClassMap: Record<string, string> = {
  created: "bg-green-200 text-green-600",
  "schedule-customers": "bg-blue-200 text-blue-600",
  "verifying-customers": "bg-yellow-200 text-yellow-600",
  "verification-failed": "bg-red-200 text-red-600",
  cancelled: "bg-orange-200 text-orange-600",
  "corrupted-ignored": "bg-purple-200 text-purple-600",
  "customers-inserted": "bg-indigo-200 text-indigo-600",
  "in-progress": "bg-teal-200 text-teal-600",
  active: "bg-primary-200 text-primary-600",
  paused: "bg-warning-200 text-warning-500",
  finished: "bg-gray-200 text-gray-500",
  completed: "bg-success-200 text-success-500",
  draft: "bg-neutral-200 text-neutral-600",
};

type CallSurveyNavbarTitleProps = {
  params: Promise<{ id: string }>;
};

const CallSurveyNavbarTitle = ({ params }: CallSurveyNavbarTitleProps) => {
  const { id } = use(params);
  const t = useTranslations("callSurvey");

  const { data: survey, isLoading } = useLocalizedQuery({
    queryKey: ["call-survey-detail", id],
    queryFn: () => callSurveyService.getSurvey(id as string),
    gcTime: 0,
    refetchOnMount: "always",
  });

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: t("tabs.active"),
      href: "/call-survey/active",
    },
    {
      label: survey?.name || "...",
      disabled: true,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center gap-3">
        <Skeleton className="w-8 h-8 rounded-full" />
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-16 rounded" />
          </div>
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/call-survey/active"
        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
      >
        <ArrowBackIos
          className="text-gray-600 rtl:rotate-180"
          sx={{ fontSize: 12 }}
        />
      </Link>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold leading-tight">{survey?.name}</h1>
          {survey?.status && (
            <span
              className={`px-2 py-1 text-xs font-semibold rounded ${statusClassMap[survey.status] || "bg-gray-200 text-gray-600"}`}
            >
              {t(`active.statuses.${survey.status}` as any) || survey.status}
            </span>
          )}
        </div>
        <Breadcrumbs items={breadcrumbItems} />
      </div>
    </div>
  );
};

export default CallSurveyNavbarTitle;
