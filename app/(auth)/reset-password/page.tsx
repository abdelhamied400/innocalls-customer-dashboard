import { redirect } from "next/navigation";
import ResetPasswordForm from "./form";

type ResetPasswordProps = {
  searchParams: Promise<{
    token: string;
  }>;
};
const ResetPassword = async ({ searchParams }: ResetPasswordProps) => {
  const { token } = await searchParams;

  if (!token) return redirect("/login");

  return (
    <div
      className="page h-full flex justify-center items-center"
      id="reset-password"
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
};

export default ResetPassword;
