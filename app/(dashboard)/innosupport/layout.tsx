"use client";
import { PropsWithChildren, useEffect } from "react";
import { useLocale, useTranslations } from "@/providers/TranslationProvider";
import useAppStore from "@/store/app.slice";
import withPermission from "@/containers/withPermission";

type InnoSupportLayoutProps = PropsWithChildren<{
  createSheet: React.ReactNode;
}>;
const InnoSupportLayout = ({ children, createSheet }: InnoSupportLayoutProps) => {
  const { setPageTitle } = useAppStore();
  const locale = useLocale();
  const t = useTranslations("innoSupport");

  useEffect(() => {
    setPageTitle(t("title"));
    return () => setPageTitle(null);
  }, [locale]);

  return (
    <div className="flex-1 h-full">
      {createSheet}
      <div className="h-full w-full">{children}</div>
    </div>
  );
};

export default withPermission(InnoSupportLayout, "completeControlTicketing");
