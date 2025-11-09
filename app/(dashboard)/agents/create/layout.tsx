"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import { PropsWithChildren } from "react";
import { useTranslations } from "@/providers/TranslationProvider";

type CreateUserLayoutProps = PropsWithChildren<object>;
const CreateUserLayout = ({ children }: CreateUserLayoutProps) => {
  const router = useRouter();
  const t = useTranslations("users.create");

  return (
    <div className="create-user-layout">
      <Sheet defaultOpen onOpenChange={() => router.back()}>
        <SheetContent side="bottom" className="h-screen p-0">
          <SheetHeader className="sr-only">
            <SheetTitle> {t("title")}</SheetTitle>
            <SheetDescription>{t("description")}</SheetDescription>
          </SheetHeader>

          {children}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CreateUserLayout;
