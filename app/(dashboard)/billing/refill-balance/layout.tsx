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

type RefillBalanceLayoutProps = PropsWithChildren<{}>;
const RefillBalanceLayout = ({ children }: RefillBalanceLayoutProps) => {
  const router = useRouter();
  const t = useTranslations("billing.refillBalance");

  return (
    <div className="refill-balance-layout">
      <Sheet defaultOpen onOpenChange={() => router.back()}>
        <SheetContent side="bottom" className="h-screen p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>{t("title")}</SheetTitle>
            <SheetDescription>
             {t('description')}
            </SheetDescription>
          </SheetHeader>

          {children}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default RefillBalanceLayout;
