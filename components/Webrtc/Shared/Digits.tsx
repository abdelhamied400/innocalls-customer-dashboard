import { digits } from "@/constants/digits";
import Digit from "./Digit";
import { useSip } from "@/providers/webrtc/SipProvider";
import { handleAddDigit } from "@/lib/dialpad-utils";
import { useState } from "react";

const Digits = () => {
  const { setNumber, number, setDialCode } = useSip();

  // Track if user manually changed country
  const [userSelectedCountry, setUserSelectedCountry] = useState(false);

  const handleDigitClick = (digit: string) => {
    const result = handleAddDigit(number, digit, userSelectedCountry);

    setNumber(result.processedNumber);

    // Update dial code if country was detected
    if (result.detectedDialCode) {
      setDialCode(result.detectedDialCode);
    }
  };

  return (
    <div className="digits grid grid-cols-3 gap-5 place-items-center">
      {digits.map((digit) => (
        <Digit
          key={digit.number}
          digit={digit}
          onClick={() => handleDigitClick(digit.value)}
          onLongPress={() => handleDigitClick(digit.long)}
        />
      ))}
    </div>
  );
};

export default Digits;
