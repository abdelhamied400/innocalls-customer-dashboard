"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useTranslations } from "@/providers/TranslationProvider";
import { useRouter, usePathname } from "next/navigation";
import { PropsWithChildren, useEffect, useState } from "react";

type CreateReportLayoutProps = PropsWithChildren<object>;

const CreateReportLayout = ({ children }: CreateReportLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("reports.oneTime.createReport");
  const [isOpen, setIsOpen] = useState(true);

  const handleOpenChange = (open: boolean) => {
    if (open) return;

    setIsOpen(false);
    router.replace("/reports/one-time");
  };

  useEffect(() => {
    if (pathname.includes("create-report")) {
      setIsOpen(true);
    }
  }, [pathname]);

  return (
    <div className="create-report-layout" key={pathname}>
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetContent side="bottom" className="h-screen p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>{t("title")}</SheetTitle>
            <SheetDescription>{t("description")}</SheetDescription>
          </SheetHeader>

          {children}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CreateReportLayout;
