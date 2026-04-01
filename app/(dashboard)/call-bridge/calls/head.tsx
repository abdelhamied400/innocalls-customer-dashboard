"use client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useTranslations } from "@/providers/TranslationProvider";

const CallBridgeCallsHead = () => {
  const t = useTranslations("callBridge.calls");

  return (
    <div className="table-head">
      <div className="flex justify-between items-center gap-4 p-3">
        <h3>{t("title")}</h3>
        <Link className={cn(buttonVariants())} href="/call-bridge/calls/create">
          {t("create")}
        </Link>
      </div>
    </div>
  );
};

export default CallBridgeCallsHead;
