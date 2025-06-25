"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { PropsWithChildren } from "react";

type CreateUserLayoutProps = PropsWithChildren<{}>;
const CreateUserLayout = ({ children }: CreateUserLayoutProps) => {
  const router = useRouter();
  const t = useTranslations("users.create");

  return (
    <div className="create-user-loading">
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

export default CreateUserLayout;
