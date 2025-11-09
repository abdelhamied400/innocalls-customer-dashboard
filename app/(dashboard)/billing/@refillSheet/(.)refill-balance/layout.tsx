"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useRouter, usePathname } from "next/navigation";
import { PropsWithChildren, useEffect, useState } from "react";

type RefillBalanceLayoutProps = PropsWithChildren<object>;
const RefillBalanceLayout = ({ children }: RefillBalanceLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
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
    <div className="refill-balance-loading" key={pathname}>
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
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
