"use client";
import LinkTabs, { LinkTab } from "@/components/LinkTabs";
import { usePathname } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";
import { useTranslations } from "next-intl";
import useAppStore from "@/store/app.slice";

type UsersLayoutProps = PropsWithChildren<{}>;
const UsersLayout = ({ children }: UsersLayoutProps) => {
  const { setPageTitle } = useAppStore();

  const t = useTranslations("users");

  useEffect(() => {
    setPageTitle(t("title"));

    // Cleanup when component unmounts
    return () => setPageTitle(null);
  }, [setPageTitle, t]);

  return (
    <>
      <LinkTabs>
        <LinkTab href="/users">{t("tabs.usersList")}</LinkTab>
        <LinkTab href="/users/monitor">{t("tabs.monitorUsers")}</LinkTab>
      </LinkTabs>
      <div className="flex-1 h-[calc(100%-3rem)]">
        <div className="h-full w-full">{children}</div>
      </div>
    </>
  );
};

export default UsersLayout;
