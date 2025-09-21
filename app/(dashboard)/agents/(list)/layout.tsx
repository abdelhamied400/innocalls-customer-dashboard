"use client";
import LinkTabs, { LinkTab } from "@/components/LinkTabs";
import { usePathname } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";
import { useLocale, useTranslations } from "@/providers/TranslationProvider";
import useAppStore from "@/store/app.slice";

type UsersLayoutProps = PropsWithChildren<{}>;
const UsersLayout = ({ children }: UsersLayoutProps) => {
  const { setPageTitle } = useAppStore();
  const locale = useLocale();

  const t = useTranslations("users");

  useEffect(() => {
    setPageTitle(t("title"));

    // Cleanup when component unmounts
    return () => setPageTitle(null);
  }, [locale]);

  return (
    <>
      <LinkTabs
        tabs={[
          { label: t("tabs.usersList"), href: "/agents" },
          { label: t("tabs.monitorUsers"), href: "/agents/monitor" },
          {
            label: t("tabs.agentsPerformance"),
            href: "/agents/agents-performance",
          },
          { label: t("tabs.timeline"), href: "/agents/timeline" },
        ]}
      />
      <div className="flex-1 h-[calc(100%-10rem)]">
        <div className="h-full w-full">{children}</div>
      </div>
    </>
  );
};

export default UsersLayout;
