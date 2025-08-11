"use client";
import LinkTabs, { LinkTab } from "@/components/LinkTabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PropsWithChildren, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import useAppStore from "@/store/app.slice";
import useRouteWithLocale from "@/hooks/use-route";
import withPermission from "@/containers/withPermission";

type BillingLayoutProps = PropsWithChildren<{
  refillSheet: React.ReactNode;
}>;
const BillingLayout = ({ children, refillSheet }: BillingLayoutProps) => {
  const { setPageTitle } = useAppStore();

  const t = useTranslations("billing");

  useEffect(() => {
    setPageTitle(t("title"));

    // Cleanup when component unmounts
    return () => setPageTitle(null);
  }, [setPageTitle, t]);

  return (
    <div className="bg-white rounded-xl p-4 h-auto sm:h-full flex flex-col gap-2">
      <div className="flex flex-wrap justify-between items-center">
        <LinkTabs>
          <LinkTab href="/billing/charges">{t("layout.tabs.charges")}</LinkTab>
          <LinkTab href="/billing/payment-history">
            {t("layout.tabs.paymentHistory")}
          </LinkTab>
          <LinkTab href="/billing/rates">{t("layout.tabs.rates")}</LinkTab>
          <LinkTab href="/billing/invoices">
            {t("layout.tabs.invoices")}
          </LinkTab>
        </LinkTabs>
        <Link href="/billing/refill-balance">
          <Button>{t("layout.actions.refillBalance")}</Button>
        </Link>
      </div>
      <div className="h-[calc(100%-3rem)]">{children}</div>
      {refillSheet}
    </div>
  );
};

export default withPermission(BillingLayout, "completeControlBilling");
