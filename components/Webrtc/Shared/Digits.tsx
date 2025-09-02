import { digits } from "@/constants/digits";
import Digit from "./Digit";
import { useSip } from "@/providers/webrtc/SipProvider";

const Digits = () => {
  const { setNumber, number } = useSip();

  const handleDigitClick = (digit: string) => {
    if (digit === "+") {
      setNumber(number.length === 0 ? "+" : number);
    } else if (/^[0-9#*]$/.test(digit)) {
      setNumber(number + digit);
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
