export type CountryOption = {
  name: string;
  dialCode: string;
  code: string;
  flag: string;
};

export const defaultCountry: CountryOption = {
  code: "(GL)",
  flag: "🌍",
  name: "Global",
  dialCode: "",
};

export const countries: CountryOption[] = [
  { code: "(EG)", flag: "🇪🇬", name: "Egypt", dialCode: "+20" },
  { code: "(KSA)", flag: "🇸🇦", name: "Saudi Arabia", dialCode: "+966" },
  { code: "(UAE)", flag: "🇦🇪", name: "United Arab Emirates", dialCode: "+971" },
  { code: "(QA)", flag: "🇶🇦", name: "Qatar", dialCode: "+974" },
  { code: "(KW)", flag: "🇰🇼", name: "Kuwait", dialCode: "+965" },
  { code: "(BH)", flag: "🇧🇭", name: "Bahrain", dialCode: "+973" },
  { code: "(JO)", flag: "🇯🇴", name: "Jordan", dialCode: "+962" },
  { code: "(OM)", flag: "🇴🇲", name: "Oman", dialCode: "+968" },
  { code: "(IQ)", flag: "🇮🇶", name: "Iraq", dialCode: "+964" },
  defaultCountry,
];
