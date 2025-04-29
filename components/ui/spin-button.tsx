import { MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "./button";

type SpinButtonProps = {
  id?: string;
  value: number;
  onChange: (val: number) => void;
  step?: number;
};

const SpinButton = ({ value = 0, onChange, ...props }: SpinButtonProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    onChange(newValue);
  };

  const handleIncrement = () => {
    const newValue = value + 1;
    onChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = value - 1;
    onChange(newValue);
  };

  return (
    <div className="spin-button flex items-center gap-1 flex-1">
      <Button
        className="-mt-4"
        size="icon"
        variant="outline"
        type="button"
        onClick={handleDecrement}
      >
        <MinusIcon />
      </Button>

      <input
        type="number"
        className="bg-transparent text-center flex-1 w-full outline-none"
        value={value}
        onChange={handleChange}
        {...props}
      />

      <Button
        className="-mt-4"
        size="icon"
        variant="outline"
        type="button"
        onClick={handleIncrement}
      >
        <PlusIcon />
      </Button>
    </div>
  );
};

export default SpinButton;
