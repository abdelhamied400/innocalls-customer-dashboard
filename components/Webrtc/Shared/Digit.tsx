type DigitProps = {
  number: string;
  alt: string;
  onClick?: () => void;
};
const Digit = ({ number, alt, onClick }: DigitProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    const audio = new Audio();
    audio.play();
  };
  return (
    <div
      className="digit bg-gray-200 rounded-full flex flex-col items-center justify-center w-16 h-16"
      role="button"
      onClick={handleClick}
    >
      <h2 className="text-3xl font-normal leading-8">{number}</h2>
      <p className="text-xs text-gray-500">{alt}</p>
    </div>
  );
};

export default Digit;
