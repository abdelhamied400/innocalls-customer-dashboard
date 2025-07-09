import { countries } from "@/constants/countries";

export const replaceCountryCode = (number: string): string => {
  const country = countries.find((c) => number.startsWith(c.code));
  if (country) {
    return number.replace(country.code, country.dialCode);
  }
  return number;
};
