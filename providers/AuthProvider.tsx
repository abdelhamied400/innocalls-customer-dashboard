import AppSpinner from "@/components/ui/AppSpinner";
import { useTranslations } from "./TranslationProvider";
import { useSession } from "next-auth/react";
import useAuth from "@/hooks/useAuth";
import { PropsWithChildren } from "react";

type AuthProviderProps = PropsWithChildren<{}>;
const AuthProvider = ({ children }: AuthProviderProps) => {
  const t = useTranslations("common.states");
  const { status } = useSession();
  const { isLoading } = useAuth();

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <AppSpinner />
        <span className="text-gray-500">{t("loading")}</span>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <AppSpinner />
        <span className="text-gray-500">{t("loading")}</span>
      </div>
    );
  }

  return children;
};
export default AuthProvider;
