"use client";
import LinkTabs, { LinkTab } from "@/components/LinkTabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PropsWithChildren, useEffect } from "react";
import { useLocale, useTranslations } from "@/providers/TranslationProvider";
import useAppStore from "@/store/app.slice";
import withPermission from "@/containers/withPermission";
import useAuthStore from "@/store/auth.slice";

type BillingLayoutProps = PropsWithChildren<{
  refillSheet: React.ReactNode;
}>;
const BillingLayout = ({ children, refillSheet }: BillingLayoutProps) => {
  const { setPageTitle } = useAppStore();
  const { Organization } = useAuthStore();
  const isPending = Organization?.status === "pending";

  const t = useTranslations("billing");
  const locale = useLocale();

  useEffect(() => {
    setPageTitle(t("title"));

    // Cleanup when component unmounts
    return () => setPageTitle(null);
  }, [locale]);

  return (
    <div className="bg-white rounded-xl p-4 h-auto sm:h-full flex flex-col gap-2">
      <div className="flex flex-wrap justify-between items-center">
        <LinkTabs>
          <LinkTab href="/billing/charges" disabled={isPending}>
            {t("layout.tabs.charges")}
          </LinkTab>
          <LinkTab href="/billing/payment-history" disabled={isPending}>
            {t("layout.tabs.paymentHistory")}
          </LinkTab>
          <LinkTab href="/billing/rates" disabled={isPending}>
            {t("layout.tabs.rates")}
          </LinkTab>
          <LinkTab href="/billing/invoices" disabled={isPending}>
            {t("layout.tabs.invoices")}
          </LinkTab>
          {/* <LinkTab href="/billing/subscription">
            {t("layout.tabs.subscriptions")}
          </LinkTab> */}
        </LinkTabs>
        {isPending ? (
          <Button disabled>{t("layout.actions.refillBalance")}</Button>
        ) : (
          <Link href="/billing/refill-balance">
            <Button>{t("layout.actions.refillBalance")}</Button>
          </Link>
        )}
      </div>
      <div className="h-[calc(100%-3rem)]">{children}</div>
      {refillSheet}
    </div>
  );
};

export default withPermission(BillingLayout, "completeControlBilling");
