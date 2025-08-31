import ForgotPasswordForm from "./form";
import { useTranslations } from "@/providers/TranslationProvider";

const ForgotPassword = () => {
    const t = useTranslations("auth.forgotPassword");

  return (
    <div
      className="page h-full flex justify-center items-center"
      id="forgot-password"
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <h1>{t("title")}</h1>
        <p className="text-sm">{t("subtitle")}</p>
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default ForgotPassword;
