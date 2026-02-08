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

type CreateTagLayoutProps = PropsWithChildren<object>;

const CreateTagLayout = ({ children }: CreateTagLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("settings.call.createTag");
  const [isOpen, setIsOpen] = useState(true);

  const handleOpenChange = (open: boolean) => {
    if (open) return;

    setIsOpen(false);
    router.replace("/settings/call");
  };

  useEffect(() => {
    if (pathname.includes("create-tag")) {
      setIsOpen(true);
    }
  }, [pathname]);

  return (
    <div className="create-tag-layout" key={pathname}>
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

export default CreateTagLayout;
