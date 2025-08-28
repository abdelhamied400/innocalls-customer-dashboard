"use client";
import { useTranslations } from "next-intl";
import FullPageError from "./FullPageError";

const NotFoundContent = () => {
  const t = useTranslations("notFound");
  return (
    <FullPageError status={404} title={t("title")} message={t("message")} />
  );
};

export default NotFoundContent;
