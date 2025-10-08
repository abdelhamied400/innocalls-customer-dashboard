"use client";
import { PropsWithChildren } from "react";
import AuthBanner from "./banner";

type AuthLayoutProps = PropsWithChildren<object>;
const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="layout h-screen" id="auth-layout">
      <div className="grid grid-cols-5 h-full">
        <div className="col-span-2 h-full hidden lg:block">
          <AuthBanner />
        </div>
        <div className="p-12 col-span-full lg:col-span-3">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
