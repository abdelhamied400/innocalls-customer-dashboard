"use client";
import { PropsWithChildren, useEffect } from "react";
import { useLocale, useTranslations } from "@/providers/TranslationProvider";
import useAppStore from "@/store/app.slice";

type InnoSupportLayoutProps = PropsWithChildren<object>;
const InnoSupportLayout = ({ children }: InnoSupportLayoutProps) => {
  const { setPageTitle } = useAppStore();
  const locale = useLocale();
  const t = useTranslations("innoSupport");

  useEffect(() => {
    setPageTitle(t("title"));
    return () => setPageTitle(null);
  }, [locale]);

  return (
    <div className="flex-1 h-full">
      <div className="h-full w-full">{children}</div>
    </div>
  );
};

export default InnoSupportLayout;
