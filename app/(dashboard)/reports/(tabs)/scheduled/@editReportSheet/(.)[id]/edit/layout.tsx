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
import { PropsWithChildren, useState, useEffect } from "react";

type EditReportLayoutProps = PropsWithChildren<object>;

const EditReportLayout = ({ children }: EditReportLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("reports.scheduled.editReport");
  const isActive = pathname.includes("/edit");
  const [isOpen, setIsOpen] = useState(isActive);

  useEffect(() => {
    if (isActive) {
      setIsOpen(true);
    }
  }, [isActive]);

  const handleOpenChange = (open: boolean) => {
    if (open) return;

    setIsOpen(false);
    router.replace("/reports/scheduled");
  };

  if (!isActive) return null;

  return (
    <div className="edit-report-layout">
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

export default EditReportLayout;
