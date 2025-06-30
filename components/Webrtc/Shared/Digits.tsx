import { digits } from "@/constants/digits";
import Digit from "./Digit";
import { useSip } from "@/providers/webrtc/SipProvider";

const Digits = () => {
  const { setNumber } = useSip();

  const handleDigitClick = (digit: string) => {
    if (digit === "+") {
      setNumber((prev) => (prev.length === 0 ? "+" : prev));
    } else if (/^[0-9#*]$/.test(digit)) {
      setNumber((prev) => prev + digit);
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
