"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countries, defaultCountry } from "@/constants/countries";
import { useMemo } from "react";

type CountrySelectProps = {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export const CountrySelect = ({
  value,
  onChange,
  placeholder = "Select a country",
}: CountrySelectProps) => {
  const selectedCountry = useMemo(
    () => countries.find((c) => c.code === value),
    [value]
  );

  const handleChange = (countryCode?: string) => {
    const country = countries.find((c) => c.code === countryCode);
    onChange(country?.code || defaultCountry.code);
  };

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger
        className="w-10 shadow-none border-0 px-1 py-0 text-2xl"
        noChevron
      >
        <SelectValue placeholder={placeholder}>
          {selectedCountry?.flag}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {countries.map((country) => {
          return (
            <SelectItem key={country.code} value={country.code}>
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
