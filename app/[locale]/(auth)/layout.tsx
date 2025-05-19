import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";
import AuthBanner from "./banner";

type AuthLayoutProps = PropsWithChildren<object>;
const AuthLayout = async ({ children }: AuthLayoutProps) => {
  const session = await auth();

  if (!!session) {
    return redirect("/");
  }

  return (
    <div className="layout h-screen" id="auth-layout">
      <div className="grid grid-cols-5 h-full">
        <div className="col-span-2 h-full">
          <AuthBanner />
        </div>
        <div className="p-12 col-span-3">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
