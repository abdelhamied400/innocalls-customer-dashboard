"use client";
import LinkTabs, { LinkTab } from "@/components/LinkTabs";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";
import useAppStore from "@/store/app.slice";

type UsageLayoutProps = PropsWithChildren<{}>;
const UsageLayout = ({ children }: UsageLayoutProps) => {
  const pathname = usePathname();
  const { setPageTitle } = useAppStore();

  const t = useTranslations("usage");

  useEffect(() => {
    setPageTitle(t("title"));

    // Cleanup when component unmounts
    return () => setPageTitle(null);
  }, [setPageTitle, t]);

  return (
    <div className="bg-white rounded-xl p-4 h-full flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <LinkTabs>
          <LinkTab
            href="/usage/summary"
            active={pathname === "/user/usage/summary"}
          >
            {t("layout.tabs.summary")}
          </LinkTab>
          <LinkTab
            href="/usage/detailed"
            active={pathname === "/user/usage/detailed"}
          >
            {t("layout.tabs.detailed")}
          </LinkTab>
        </LinkTabs>
      </div>
      <div className="h-[calc(100%-3rem)]">{children}</div>
    </div>
  );
};

export default UsageLayout;
