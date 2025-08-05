import Field from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { digits } from "@/constants/digits";
import { useSip } from "@/providers/webrtc/SipProvider";
import React from "react";
import { CountrySelect } from "./DialpadCountrySelect";
import { useTranslations } from "next-intl";

const DialpadInput = () => {
  const t = useTranslations("webrtc.fields");

  const { number, setNumber, countryCode, setCountryCode, call } = useSip();

  const onNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Allow + only as the first character, then only digits, #, *
    if (value.startsWith("+")) {
      value = "+" + value.slice(1).replace(/[^0-9#*]/g, "");
    } else {
      value = value.replace(/[^0-9#*]/g, "");
    }

    setNumber(value);
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

  return (
    <Field label={t("phone.label")}>
      <CountrySelect
        value={countryCode}
        onChange={setCountryCode}
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
