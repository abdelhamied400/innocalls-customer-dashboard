import Field from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { digits } from "@/constants/digits";
import { useSip } from "@/providers/webrtc/SipProvider";
import React from "react";

const DialpadInput = () => {
  const { number, setNumber } = useSip();

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
    const digit = digits.find((d) => d.value === key);
    if (digit) {
      // play tone
      const audio = new Audio(digit.tone);
      audio.play().catch((err) => console.error("Error playing tone:", err));
    }
  };

  return (
    <Field label="Number">
      <Input
        value={number}
        variant="field"
        placeholder="Enter number..."
        onChange={onNumberChange}
        onKeyDown={onKeyDown}
      />
    </Field>
  );
};

export default DialpadInput;
