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

type RefillBalanceLayoutProps = PropsWithChildren<{}>;
const RefillBalanceLayout = ({ children }: RefillBalanceLayoutProps) => {
  const router = useRouter();

  const handleClose = () => {
    try {
      const history = window.history;
      const referrer = document.referrer;
      const currentOrigin = window.location.origin;

      if (history.length <= 0) {
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
    <div className="refill-balance-loading">
      <Sheet defaultOpen onOpenChange={handleClose}>
        <SheetContent side="bottom" className="h-screen p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Refill Balance</SheetTitle>
            <SheetDescription>
              This is the refill balance sheet. You can add funds to your
              account here.
            </SheetDescription>
          </SheetHeader>

          {children}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default RefillBalanceLayout;
