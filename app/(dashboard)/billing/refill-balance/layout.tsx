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

type RefillBalanceLayoutProps = PropsWithChildren<{}>;
const RefillBalanceLayout = ({ children }: RefillBalanceLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("billing.refillBalance");
  const [isOpen, setIsOpen] = useState(true);

  const handleOpenChange = (open: boolean) => {
    if (open) return;

    // Only handle close action
    setIsOpen(false);
    router.replace("/billing/charges");
  };

  useEffect(() => {
    // Always open when component mounts or when pathname changes to refill-balance
    if (pathname.includes("refill-balance")) {
      setIsOpen(true);
    }
  }, [pathname]);

  return (
    <div className="refill-balance-layout" key={pathname}>
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

export default RefillBalanceLayout;
