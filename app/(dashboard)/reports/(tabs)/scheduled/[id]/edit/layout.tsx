"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useTranslations } from "@/providers/TranslationProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { PropsWithChildren, useState } from "react";

const EditReportLayout = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("reports.scheduled.editReport");
  const [isOpen, setIsOpen] = useState(true);

  const handleOpenChange = (open: boolean) => {
    if (open) return;

    setIsOpen(false);

    if (searchParams.get("from")) {
      console.log("navigating back to", searchParams.get("from"));
      router.replace(searchParams.get("from")!);
      return;
    }

    router.replace("/reports/scheduled");
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent side="bottom" className="h-screen p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>{t("title")}</SheetTitle>
          <SheetDescription>{t("description")}</SheetDescription>
        </SheetHeader>

        {children}
      </SheetContent>
    </Sheet>
  );
};

export default EditReportLayout;
