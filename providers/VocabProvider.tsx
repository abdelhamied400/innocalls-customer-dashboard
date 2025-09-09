"use client";
import AppSpinner from "@/components/ui/AppSpinner";
import { useSession } from "next-auth/react";
import { useTranslations } from "@/providers/TranslationProvider";
import { PropsWithChildren } from "react";
import { useVocab } from "@/hooks/useVocab";

type VocabProviderProps = PropsWithChildren<{}>;
const VocabProvider = ({ children }: VocabProviderProps) => {
  // Compute loading state from all queries
  const t = useTranslations("common.states");

  const { status } = useSession();
  const { loading } = useVocab();

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <AppSpinner />
        <span className="text-gray-500">{t("loading")}</span>
      </div>
    );
  }

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
