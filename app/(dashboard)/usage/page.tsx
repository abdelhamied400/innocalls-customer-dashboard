"use client";

import useAppStore from "@/store/app.slice";
import { useLocale, useTranslations } from "@/providers/TranslationProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Usage = () => {
  const router = useRouter();
  const t = useTranslations("sidebar.navigation");
  const { setPageTitle } = useAppStore();
  const locale = useLocale();

  useEffect(() => {
    setPageTitle(t("usage"));
  }, [locale]);

  useEffect(() => {
    router.push("/usage/summary");
  }, [router]);
  return null; // This component redirects to the summary page
};

export default Usage;
