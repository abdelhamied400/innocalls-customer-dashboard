import Field from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { digits } from "@/constants/digits";
import { useSip } from "@/providers/webrtc/SipProvider";
import React, { useState } from "react";
import { CountrySelect } from "./DialpadCountrySelect";
import { useTranslations } from "@/providers/TranslationProvider";
import { defaultCountry, webrtcCountries } from "@/constants/countries";
import { processPhoneNumber } from "@/lib/dialpad-utils";

const DialpadInput = () => {
  const t = useTranslations("webrtc.fields");
  const { number, setNumber, dialCode, setDialCode, call } = useSip();

  // Track if user manually changed country
  const [userSelectedCountry, setUserSelectedCountry] = useState(false);

  // Handle typing in the input
  const onNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const result = processPhoneNumber(value, userSelectedCountry);

    setNumber(result.processedNumber);

    // Update dial code if country was detected
    if (result.detectedDialCode) {
      setDialCode(result.detectedDialCode);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;

    if (key === "Enter") {
      call();
      return;
    }

    const digit = digits.find((d) => d.value === key);
    if (digit) {
      // play tone
      const audio = new Audio(digit.tone);
      audio.play().catch((err) => console.error("Error playing tone:", err));
    }
  };

  const handleCountryChange = (code: string) => {
    const isDefault = code === defaultCountry.code;
    setDialCode(code);
    setUserSelectedCountry(true);
    // prepend the dial code to the number
    if (!isDefault) {
      const country = webrtcCountries.find((c) => c.code === code);
      if (country) {
        // check if the number starts with any country dialCode
        // if so replace it
        const countryDialCodes = webrtcCountries.map((c) => c.dialCode);
        const matchingDialCode = countryDialCodes.find((dial) =>
          number.startsWith(dial)
        );
        if (matchingDialCode) {
          setNumber(number.replace(matchingDialCode, country.dialCode));
        } else {
          setNumber(`${country.dialCode}${number}`);
        }
      }
    }
  };

  return (
    <Field label={t("phone.label")}>
      <CountrySelect
        value={dialCode}
        onChange={handleCountryChange}
        placeholder={t("country.placeholder")}
      />
      <Input
        value={number}
        variant="field"
        placeholder={t("phone.placeholder")}
        onChange={onNumberChange}
        onKeyDown={onKeyDown}
        style={{ direction: "ltr", textAlign: "left" }}
      />
    </Field>
  );
};

export default DialpadInput;
