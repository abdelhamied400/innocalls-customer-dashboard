"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { webrtcCountries, defaultCountry } from "@/constants/countries";
import Image from "next/image";
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
    () => webrtcCountries.find((c) => c.code === value) || defaultCountry,
    [value]
  );

  const handleChange = (countryCode?: string) => {
    const country = webrtcCountries.find((c) => c.code === countryCode);
    onChange(country?.code || defaultCountry.code);
  };

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger
        className="w-10 shadow-none border-0 px-1 py-0 text-2xl"
        noChevron
      >
        <SelectValue placeholder={placeholder}>
          {selectedCountry ? (
            <Image
              src={selectedCountry.flag}
              alt={selectedCountry.name}
              width={24}
              height={24}
            />
          ) : null}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {webrtcCountries.map((country) => {
          return (
            <SelectItem key={country.code} value={country.code}>
              <span className="flex items-center gap-2">
                <Image
                  src={country.flag}
                  alt={country.name}
                  width={24}
                  height={24}
                />
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
