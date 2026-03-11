"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "@/providers/TranslationProvider";
import { useEffect } from "react";
import VerifyDemoForm from "./form";

const VerifyDemo = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const t = useTranslations("auth.verifyDemo");

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [token, router]);

  if (!token) return null;

  return (
    <div
      className="page h-full flex justify-center items-center"
      id="verify-demo"
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        <VerifyDemoForm token={token} />
      </div>
    </div>
  );
};

export default VerifyDemo;
