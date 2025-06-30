import { digits } from "@/constants/digits";
import Digit from "./Digit";
import { useSip } from "@/providers/webrtc/SipProvider";

const Digits = () => {
  const { setNumber } = useSip();

  const handleDigitClick = (digit: string) => {
    setNumber((prev) => prev + digit);
  };

  return (
    <div className="digits grid grid-cols-3 gap-5 place-items-center">
      {digits.map((digit) => (
        <Digit
          key={digit.number}
          digit={digit}
          onClick={() => handleDigitClick(digit.value)}
        />
      ))}
    </div>
  );
};

export default Digits;
