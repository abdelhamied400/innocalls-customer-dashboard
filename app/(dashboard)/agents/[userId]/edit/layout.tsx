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

type EditUserLayoutProps = PropsWithChildren<{}>;
const EditUserLayout = ({ children }: EditUserLayoutProps) => {
  const router = useRouter();
  const t = useTranslations("users.update");

  return (
    <div className="edit-user-layout">
      <Sheet defaultOpen onOpenChange={() => router.back()}>
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

export default EditUserLayout;
