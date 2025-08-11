"use client";
import FullPageError from "@/containers/FullPageError";
import { NextIntlClientProvider, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { defaultLocale, LocaleSlug } from "@/i18n/config";
import localFont from "next/font/local";
import { NextFontWithVariable } from "next/dist/compiled/@next/font";

const poppins = localFont({
  src: "./fonts/Poppins.otf",
  variable: "--font-poppins",
  weight: "100 900",
});
const cairo = localFont({
  src: "./fonts/Cairo.ttf",
  variable: "--font-cairo",
  weight: "100 900",
});

const fonts: Record<LocaleSlug, NextFontWithVariable> = {
  en: poppins,
  ar: cairo,
};

const getMessages = (locale: LocaleSlug) => {
  const messages = {
    en: {
      common: {
        backToHome: "Back to Home",
      },
      notFound: {
        title: "Page Not Found",
        message: "The page you are looking for does not exist.",
      },
    },
    ar: {
      common: {
        backToHome: "العودة إلى الصفحة الرئيسية",
      },
      notFound: {
        title: "الصفحة غير موجودة",
        message: "الصفحة التي تبحث عنها غير موجودة.",
      },
    },
  };
  return messages[locale] || messages[defaultLocale];
};

export default function NotFound() {
  const pathname = usePathname();
  const match = pathname.match(/^\/([a-z]{2})(\/|$)/);
  const locale = (match?.[1] || defaultLocale) as LocaleSlug;

  return (
    <html lang={locale}>
      <body className={`${fonts[locale].variable} antialiased`}>
        <NextIntlClientProvider messages={getMessages(locale)} locale={locale}>
          <NotFoundContent />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

const NotFoundContent = () => {
  const t = useTranslations("notFound");
  return (
    <FullPageError status={404} title={t("title")} message={t("message")} />
  );
};
