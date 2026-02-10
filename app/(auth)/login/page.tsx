"use client";
import Image from "next/image";
import LoginForm from "./form";
import { useTranslations } from "@/providers/TranslationProvider";

const Login = () => {
  const t = useTranslations("auth.login");

  return (
    <div className="page h-full flex justify-center items-center" id="login">
      <div className="flex flex-col items-center justify-center gap-2">
        <Image
          className="block lg:hidden"
          src="/assets/images/logo-hb.svg"
          alt="Logo"
          width={240}
          height={48}
        />
        <h1>{t("title")}</h1>
        <p className="text-sm">{t("subtitle")}</p>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
