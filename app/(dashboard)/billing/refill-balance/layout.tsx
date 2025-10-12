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

  const handleClose = () => {
    try {
      const history = window.history;
      const referrer = document.referrer;
      const currentOrigin = window.location.origin;

      if (history.length <= 1) {
        router.push("/billing/charges");
        return;
      }

      // Check if referrer exists and matches your site
      const isSameOrigin =
        referrer && new URL(referrer).origin === currentOrigin;

      if (isSameOrigin) {
        router.back();
      } else {
        // fallback if user came from external site or direct visit
        router.push("/billing/charges");
      }
    } catch {
      console.error("Failed to parse referrer URL");
      // Just in case URL parsing fails
      router.push("/billing/charges");
    }
  };

  return (
    <div className="refill-balance-layout">
      <Sheet defaultOpen onOpenChange={handleClose}>
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

export default RefillBalanceLayout;
