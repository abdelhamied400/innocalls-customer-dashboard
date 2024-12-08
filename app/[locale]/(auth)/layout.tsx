import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

type AuthLayoutProps = PropsWithChildren<object>;
const AuthLayout = async ({ children }: AuthLayoutProps) => {
  const session = await auth();

  if (!!session) {
    return redirect("/");
  }

  return (
    <div className="layout" id="auth-layout">
      {children}
    </div>
  );
};

export default AuthLayout;
