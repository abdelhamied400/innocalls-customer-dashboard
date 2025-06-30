import { Digit as DigitType } from "@/constants/digits";

type DigitProps = {
  digit: DigitType;
  onClick?: () => void;
};
const Digit = ({ digit, onClick }: DigitProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    const audio = new Audio(digit.tone);
    audio.play();
  };
  return (
    <div
      className="digit bg-gray-200 rounded-full flex flex-col items-center justify-center w-16 h-16 select-none"
      role="button"
      onClick={handleClick}
    >
      <h2 className="text-3xl font-normal leading-8">{digit.number}</h2>
      <p className="text-xs text-gray-500">{digit.alt}</p>
    </div>
  );
};

export default Digit;
