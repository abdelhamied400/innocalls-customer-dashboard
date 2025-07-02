"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserCountry } from "@/hooks/use-user-country";
import { useEffect, useState } from "react";

// utils/countries.ts
export const countries = [
  { code: "US", flag: "🇺🇸", name: "United States", dialCode: "+1" },
  { code: "EG", flag: "🇪🇬", name: "Egypt", dialCode: "+20" },
  { code: "GB", flag: "🇬🇧", name: "United Kingdom", dialCode: "+44" },
  { code: "FR", flag: "🇫🇷", name: "France", dialCode: "+33" },
  { code: "DE", flag: "🇩🇪", name: "Germany", dialCode: "+49" },
  { code: "JP", flag: "🇯🇵", name: "Japan", dialCode: "+81" },
  { code: "IN", flag: "🇮🇳", name: "India", dialCode: "+91" },
  { code: "CN", flag: "🇨🇳", name: "China", dialCode: "+86" },
  { code: "SA", flag: "🇸🇦", name: "Saudi Arabia", dialCode: "+966" },
  { code: "BR", flag: "🇧🇷", name: "Brazil", dialCode: "+55" },
  { code: "G", flag: "🌍", name: "Global", dialCode: "" }, // Global uses empty string as value
];

type CountrySelectProps = {
  value?: string; // the dialCode, e.g. "+20"
  onChange: (value: string) => void;
  placeholder?: string;
};

export const CountrySelect = ({
  value,
  onChange,
  placeholder = "Select a country",
}: CountrySelectProps) => {
  const userCountry = useUserCountry();
  const [initialized, setInitialized] = useState(false);
  const [hasAutoSelected, setHasAutoSelected] = useState(false);

  // Set initial value to "Global" (empty string)
  useEffect(() => {
    if (!initialized && value === undefined) {
      onChange(""); // empty means Global
      setInitialized(true);
    }
  }, [initialized, value, onChange]);

  // If userCountry is available and current value is Global (""), try to match and update

  useEffect(() => {
    if (!hasAutoSelected && value === "" && userCountry) {
      const match = countries.find((c) => c.code === userCountry && c.dialCode);
      if (match) {
        onChange(match.dialCode);
        setHasAutoSelected(true);
      }
    }
  }, [value, userCountry, onChange, hasAutoSelected]);

  // Determine selected country (fallback to Global if not found)
  const selected = countries.find(
    (c) => c.dialCode === value || (c.code === "G" && value === "")
  );

  return (
    <Select
      value={value || "G"} // Radix can't use empty string, so map to "G"
      onValueChange={(val) => onChange(val === "G" ? "" : val)}
    >
      <SelectTrigger
        className="w-12 shadow-none border-0 px-1 py-0 text-2xl"
        noChevron
      >
        <SelectValue placeholder={placeholder}>
          {selected ? (
            selected.flag
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {countries.map((country) => {
          const itemValue = country.dialCode || "G"; // Use "G" for Global
          return (
            <SelectItem key={country.code} value={itemValue}>
              <span className="flex items-center gap-2">
                <span className="text-xl">{country.flag}</span>
                {country.name}
                {country.dialCode && (
                  <span className="ml-auto text-muted-foreground">
                    {country.dialCode}
                  </span>
                )}
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
