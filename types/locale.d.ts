export type LocaleCode = "en" | "ar";
export type Direction = "ltr" | "rtl";

type ILocale = {
  locale: string;
  name: string;
  code: LocaleCode;
  dir: Direction;
};
type Locale = Record<LocaleCode, ILocale>;
export default Locale;
