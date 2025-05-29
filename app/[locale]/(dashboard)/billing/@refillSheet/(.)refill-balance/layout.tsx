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
  return (
    <div className="refill-balance-loading">
      <Sheet defaultOpen onOpenChange={() => router.back()}>
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
