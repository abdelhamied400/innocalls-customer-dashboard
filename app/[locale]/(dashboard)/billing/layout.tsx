"use client";
import LinkTabs, { LinkTab } from "@/components/LinkTabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

type BillingLayoutProps = PropsWithChildren<{}>;
const BillingLayout = ({ children }: BillingLayoutProps) => {
  const pathname = usePathname();

  return (
    <div className="bg-white rounded-xl p-4">
      <div className="flex justify-between items-center">
        <LinkTabs>
          <LinkTab href="/billing" active={pathname === "/billing/charges"}>
            Charges
          </LinkTab>
          <LinkTab
            href="/billing/payment-history"
            active={pathname === "/billing/payment-history"}
          >
            Payment History
          </LinkTab>
          <LinkTab href="/billing/rates" active={pathname === "/billing/rates"}>
            Rates
          </LinkTab>
          <LinkTab
            href="/billing/invoices"
            active={pathname === "/billing/invoices"}
          >
            Invoices
          </LinkTab>
        </LinkTabs>
        <Link href="/billing/refill-balance">
          <Button>Refill Balance</Button>
        </Link>
      </div>
      {children}
    </div>
  );
};

export default BillingLayout;
