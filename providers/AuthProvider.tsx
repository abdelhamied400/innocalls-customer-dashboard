import AppSpinner from "@/components/ui/AppSpinner";
import { useTranslationContext, useTranslations } from "./TranslationProvider";
import { useSession } from "next-auth/react";
import useAuth from "@/hooks/useAuth";
import { PropsWithChildren } from "react";

type AuthProviderProps = PropsWithChildren<object>;
const AuthProvider = ({ children }: AuthProviderProps) => {
  const t = useTranslations("common.states");
  const { status } = useSession();
  const { isLoading: authLoading } = useAuth();
  const { isLoading: translationsLoading } = useTranslationContext();

  if (status === "loading" || authLoading || translationsLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <AppSpinner />
        <span className="text-gray-500">
          {!translationsLoading ? t("loading") : "Loading..."}
        </span>
      </div>
    );
  }

  return children;
};
export default AuthProvider;
