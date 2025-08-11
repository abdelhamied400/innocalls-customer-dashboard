"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

type FullPageErrorProps = {
  status: number;
  title: string;
  message: string;
};

const FullPageError = ({ status, title, message }: FullPageErrorProps) => {
  const t = useTranslations("common");

  return (
    <div className="bg-red-100 h-screen w-screen absolute inset-0 z-50">
      {/* Animated gradient background */}
      <div className="animate-gradient bg-gradient-to-br from-red-100 via-pink-200 to-yellow-200 opacity-95" />
      <div className="relative flex flex-col items-center justify-center h-full z-10">
        <div className="rounded-xl px-10 py-8 flex flex-col items-center gap-2">
          <h1 className="text-6xl font-black text-red-500 mb-4">
            {status}: {title}
          </h1>
          <p className="mt-2 text-xl text-gray-700 text-center">{message}</p>
          <Link href="/" className="underline text-primary-500">
            {t("backToHome")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FullPageError;
