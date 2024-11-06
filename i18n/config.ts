export type Direction = "ltr" | "rtl";
export type LocaleSlug = "en" | "ar";

export type Locale = {
  name: string;
  slug: LocaleSlug;
  dir: Direction;
  flag: string;
};

export const locales: Record<LocaleSlug, Locale> = {
  en: {
    name: "English",
    slug: "en",
    dir: "ltr",
    flag: "🇺🇸",
  },
  ar: {
    name: "العربيه",
    slug: "ar",
    dir: "rtl",
    flag: "🇸🇦",
  },
};

export const defaultLocale = "en";

export const localesArray = Object.values(locales);
export const localeSlugs = Object.keys(locales);

export const localeNames = localesArray.map((locale) => locale.name);
