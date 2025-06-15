import { redirect } from "next/navigation";
import ResetPasswordForm from "./form";
import { getTranslations } from "next-intl/server";

type ResetPasswordProps = {
  searchParams: Promise<{
    token: string;
  }>;
};
const ResetPassword = async ({ searchParams }: ResetPasswordProps) => {
  const t = await getTranslations("auth.resetPassword");

  const { token } = await searchParams;

  if (!token) return redirect("/login");

  return (
    <div
      className="page h-full flex justify-center items-center"
      id="reset-password"
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <h1>{t("title")}</h1>
        <p className="text-sm">{t("subtitle")}</p>
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
};

export default ResetPassword;
