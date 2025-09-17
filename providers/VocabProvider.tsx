"use client";
import AppSpinner from "@/components/ui/AppSpinner";
import { useTranslations } from "@/providers/TranslationProvider";
import { PropsWithChildren } from "react";
import { useVocab } from "@/hooks/useVocab";

type VocabProviderProps = PropsWithChildren<{}>;
const VocabProvider = ({ children }: VocabProviderProps) => {
  const t = useTranslations("common.states");

  const { loading } = useVocab();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <AppSpinner />
        <span className="text-gray-500">{t("loading")}</span>
      </div>
    );
  }

  return children;
};

export default VocabProvider;
