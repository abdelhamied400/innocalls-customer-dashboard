"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useTranslations } from "@/providers/TranslationProvider";
import { useRouter } from "next/navigation";
import { PropsWithChildren } from "react";

type CreateTicketLayoutProps = PropsWithChildren<object>;
const CreateTicketLayout = ({ children }: CreateTicketLayoutProps) => {
  const router = useRouter();
  const t = useTranslations("innoSupport.create");

  return (
    <div className="create-ticket-layout">
      <Sheet defaultOpen onOpenChange={() => router.back()}>
        <SheetContent side="bottom" className="h-screen p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>{t("title")}</SheetTitle>
            <SheetDescription>{t("title")}</SheetDescription>
          </SheetHeader>

          {children}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CreateTicketLayout;
