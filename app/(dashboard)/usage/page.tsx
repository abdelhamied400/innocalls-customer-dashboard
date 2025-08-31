"use client";

import useAppStore from "@/store/app.slice";
import { useTranslations } from "@/providers/TranslationProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Usage = () => {
  const router = useRouter();
  const t = useTranslations("sidebar.navigation");
  const { setPageTitle } = useAppStore();

  useEffect(() => {
    setPageTitle(t("usage"));
  }, []);

  useEffect(() => {
    router.push("/usage/summary");
  }, [router]);
  return null; // This component redirects to the summary page
};

export default Usage;
