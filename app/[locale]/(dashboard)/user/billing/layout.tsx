"use client";
import LinkTabs, { LinkTab } from "@/components/LinkTabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";
import { useTranslations } from "next-intl";

type BillingLayoutProps = PropsWithChildren<{
  refillSheet: React.ReactNode;
}>;
const BillingLayout = ({ children, refillSheet }: BillingLayoutProps) => {
  const pathname = usePathname();
  const t = useTranslations("billing.layout");

  return (
    <div className="bg-white rounded-xl p-4 h-full flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <LinkTabs>
          <LinkTab
            href="/billing"
            active={pathname === "/user/billing/charges"}
          >
            {t("tabs.charges")}
          </LinkTab>
          <LinkTab
            href="/billing/payment-history"
            active={pathname === "/user/billing/payment-history"}
          >
            {t("tabs.paymentHistory")}
          </LinkTab>
          <LinkTab
            href="/billing/rates"
            active={pathname === "/user/billing/rates"}
          >
            {t("tabs.rates")}
          </LinkTab>
          <LinkTab
            href="/billing/invoices"
            active={pathname === "/user/billing/invoices"}
          >
            {t("tabs.invoices")}
          </LinkTab>
        </LinkTabs>
        <Link href="/billing/refill-balance">
          <Button>{t("actions.refillBalance")}</Button>
        </Link>
      </div>
      <div className="h-[calc(100%-3rem)]">{children}</div>
      {refillSheet}
    </div>
  );
};

export default BillingLayout;
