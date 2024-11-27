import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

type AuthLayoutProps = PropsWithChildren<object>;
const AuthLayout = ({ children }: AuthLayoutProps) => {
  const session = auth();

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
