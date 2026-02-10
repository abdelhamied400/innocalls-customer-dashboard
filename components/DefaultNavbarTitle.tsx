"use client";

import useAppStore from "@/store/app.slice";
import { useTranslations } from "@/providers/TranslationProvider";

const DefaultNavbarTitle = () => {
  const t = useTranslations("sidebar");
  const { pageTitle } = useAppStore();

  return <h1>{pageTitle || t("navigation.dashboard")}</h1>;
};

export default DefaultNavbarTitle;
