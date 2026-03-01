"use client";
import Breadcrumbs, { BreadcrumbItem } from "@/components/Breadcrumbs";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { useTranslations } from "@/providers/TranslationProvider";
import autoDialerAgentService from "@/services/auto-dialer-agent.service";
import autoDialerService from "@/services/auto-dialer.service";
import { ArrowBackIos } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { use } from "react";

type AutodialerNavbarTitleProps = {
  params: Promise<{
    id: string;
  }>;
};

const classMap: Record<string, string> = {
  created: "bg-green-200 text-green-600 hover:bg-green-200",
  "schedule-customers": "bg-blue-200 text-blue-600 hover:bg-blue-200",
  "verifying-customers": "bg-yellow-200 text-yellow-600 hover:bg-yellow-200",
  "verification-failed": "bg-red-200 text-red-600 hover:bg-red-200",
  "corrupted-ignored": "bg-purple-200 text-purple-600 hover:bg-purple-200",
  "customers-inserted": "bg-orange-200 text-orange-600 hover:bg-orange-200",
  "in-progress": "bg-teal-200 text-teal-600 hover:bg-teal-200",
  active: "bg-primary-200 text-primary-600 hover:bg-primary-200",
  paused: "bg-warning-200 text-warning-500 hover:bg-warning-200",
  started: "bg-cyan-200 text-cyan-600 hover:bg-cyan-200",
  completed: "bg-success-200 hover:bg-success-200 text-success-500",
  cancelled: "bg-destructive-200 hover:bg-destructive-200 text-destructive-500",
  failed: "bg-warning-200 hover:bg-warning-200 text-warning-500",
  finished: "bg-gray-200 hover:bg-gray-200 text-gray-500",
};

const AutodialerNavbarTitle = ({ params }: AutodialerNavbarTitleProps) => {
  const { id } = use(params);
  const t = useTranslations("autoDialer.campaignDetails");
  const { data: session } = useSession();

  const getCampaign =
    session?.userType === "agent"
      ? autoDialerAgentService.getCampaign
      : autoDialerService.getCampaign;

  const { data: campaign, isFetching } = useLocalizedQuery({
    queryKey: ["auto-dialer-campaign", id],
    queryFn: () => getCampaign(id as string),
    gcTime: 0,
    refetchInterval: 10000,
    refetchOnMount: "always",
  });

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: t("campaigns"),
      href: "/auto-dialer/active",
    },
    {
      label: campaign?.name || "...",
      disabled: true,
    },
  ];

  if (isFetching) {
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
        href="/auto-dialer/active"
        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
      >
        <ArrowBackIos
          className="text-gray-600 rtl:rotate-180"
          sx={{ fontSize: 12 }}
        />
      </Link>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold leading-tight">{campaign?.name}</h1>
          {campaign?.status && (
            <span
              className={`px-2 py-1 text-xs font-semibold rounded ${classMap[campaign.status]}`}
            >
              {t(`status.${campaign.status}`)}
            </span>
          )}
        </div>
        <Breadcrumbs items={breadcrumbItems} />
      </div>
    </div>
  );
};

export default AutodialerNavbarTitle;
