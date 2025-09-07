"use client";

import FullPageError from "@/containers/FullPageError";
import { useTranslations } from "@/providers/TranslationProvider";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <FullPageError status={404} title={t("title")} message={t("message")} />
  );
}
