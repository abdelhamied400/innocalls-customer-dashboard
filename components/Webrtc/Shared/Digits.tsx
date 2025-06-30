import { digits } from "@/constants/digits";
import Digit from "./Digit";

const Digits = () => {
  return (
    <div className="digits grid grid-cols-3 gap-5 place-items-center">
      {digits.map((digit) => (
        <Digit
          key={digit.number}
          number={digit.number}
          alt={digit.alt}
          onClick={() => {
            const audio = new Audio(digit.tone);
            audio.play();
          }}
        />
      ))}
    </div>
  );
};

export default Digits;
