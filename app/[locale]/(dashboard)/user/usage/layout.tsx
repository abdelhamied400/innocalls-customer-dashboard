"use client";
import LinkTabs, { LinkTab } from "@/components/LinkTabs";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

type UsageLayoutProps = PropsWithChildren<{}>;
const UsageLayout = ({ children }: UsageLayoutProps) => {
  const pathname = usePathname();
  const t = useTranslations("usage.layout.tabs");

  return (
    <div className="bg-white rounded-xl p-4 h-full flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <LinkTabs>
          <LinkTab href="/usage/summary" active={pathname === "/usage/summary"}>
            {t("summary")}
          </LinkTab>
          <LinkTab
            href="/usage/detailed"
            active={pathname === "/usage/detailed"}
          >
            {t("detailed")}
          </LinkTab>
        </LinkTabs>
      </div>
      <div className="h-[calc(100%-3rem)]">{children}</div>
    </div>
  );
};

export default UsageLayout;
