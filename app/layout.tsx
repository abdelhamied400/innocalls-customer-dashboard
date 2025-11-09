import type { Metadata } from "next";
import { PropsWithChildren } from "react";
import { locales, LocaleSlug, defaultLocale } from "@/i18n/config";
import MainProvider from "@/providers/MainProvider";
import { NextFontWithVariable } from "next/dist/compiled/@next/font";
import localFont from "next/font/local";
import "@/styles/main.scss";
import "@xyflow/react/dist/style.css";

const poppins = localFont({
  src: "./fonts/Poppins.otf",
  variable: "--font-poppins",
  weight: "100 200 300 400 500 600 700 800 900",
});
const cairo = localFont({
  src: "./fonts/Cairo.ttf",
  variable: "--font-cairo",
  weight: "100 200 300 400 500 600 700 800 900",
});

const fonts: Record<LocaleSlug, NextFontWithVariable> = {
  en: poppins,
  ar: cairo,
};

// 🌐 Metadata for the application
export const metadata: Metadata = {
  title:
    "Innocalls 🚀 | Leading Contact Center Solutions Provider in the Middle East 🌍",
  description:
    "Leading Contact Center Solutions Provider for Call Centers in the Middle East",
};

type RootLayoutProps = PropsWithChildren;

const RootLayout = ({ children }: RootLayoutProps) => {
  // Use default locale since we're not using file-based i18n routing
  const targetLocale = defaultLocale;
  const localeObj = locales[targetLocale];

  return (
    <html lang={targetLocale} dir={localeObj.dir}>
      <body className={`${fonts[targetLocale].variable} antialiased`}>
        <MainProvider>{children}</MainProvider>
      </body>
    </html>
  );
};

export default RootLayout;
