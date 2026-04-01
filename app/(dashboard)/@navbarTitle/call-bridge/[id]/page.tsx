"use client";
import Breadcrumbs, { BreadcrumbItem } from "@/components/Breadcrumbs";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { useTranslations } from "@/providers/TranslationProvider";
import callBridgeService from "@/services/call-bridge.service";
import { ArrowBackIos } from "@mui/icons-material";
import Link from "next/link";
import { use } from "react";

type CallBridgeNavbarTitleProps = {
  params: Promise<{
    id: string;
  }>;
};

const CallBridgeNavbarTitle = ({ params }: CallBridgeNavbarTitleProps) => {
  const { id } = use(params);
  const t = useTranslations("callBridge");

  const { data: bridge, isFetching } = useLocalizedQuery({
    queryKey: ["call-bridge-detail", id],
    queryFn: () => callBridgeService.getBridge(id as string),
    gcTime: 0,
  });

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: t("list.title"),
      href: "/call-bridge",
    },
    {
      label: bridge?.name || "...",
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
          </div>
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/call-bridge"
        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
      >
        <ArrowBackIos
          className="text-gray-600 rtl:rotate-180"
          sx={{ fontSize: 12 }}
        />
      </Link>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold leading-tight">{bridge?.name}</h1>
        </div>
        <Breadcrumbs items={breadcrumbItems} />
      </div>
    </div>
  );
};

export default CallBridgeNavbarTitle;
