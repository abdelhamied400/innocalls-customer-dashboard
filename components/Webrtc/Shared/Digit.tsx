import { Button } from "@/components/ui/button";
import { Digit as DigitType } from "@/constants/digits";

type DigitProps = {
  digit: DigitType;
  onClick?: () => void;
  onLongPress?: () => void;
};
const Digit = ({ digit, onClick, onLongPress }: DigitProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    const audio = new Audio(digit.tone);
    audio.play();
  };

  return (
    <Button
      className="digit bg-gray-200 rounded-full flex flex-col gap-0 items-center justify-center w-16 h-16 select-none"
      variant="unstyled"
      onClick={handleClick}
      onLongPress={onLongPress}
    >
      <h2 className="text-3xl font-normal leading-8 font-code">
        {digit.number}
      </h2>
      <p className="text-xs text-gray-500">{digit.alt}</p>
    </Button>
  );
};

export default Digit;
