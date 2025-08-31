"use client";
import { defaultLocale, LocaleSlug } from "@/i18n/config";
import localFont from "next/font/local";
import { NextFontWithVariable } from "next/dist/compiled/@next/font";
import NotFoundContent from "@/containers/NotFoundContent";
import { TranslationProvider } from "@/providers/TranslationProvider";

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

export default function NotFound() {
  const locale = defaultLocale; // Use default locale for not found page

  return (
    <html lang={locale}>
      <body className={`${fonts[locale].variable} antialiased`}>
        <TranslationProvider initialLocale={locale}>
          <NotFoundContent />
        </TranslationProvider>
      </body>
    </html>
  );
}
