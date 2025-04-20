import { MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "./button";

type SpinButtonProps = {
  value: string;
  onChange: (e: string) => void;
  step?: number;
};

const SpinButton = ({ value, onChange, ...props }: SpinButtonProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  const handleIncrement = () => {
    const newValue = parseInt(value) + 1;
    onChange(newValue.toString());
  };

  const handleDecrement = () => {
    const newValue = parseInt(value) - 1;
    onChange(newValue.toString());
  };

  return (
    <div className="flex items-center gap-1 flex-1">
      <Button
        size="icon"
        variant="outline"
        type="button"
        onClick={handleDecrement}
      >
        <MinusIcon />
      </Button>

      <input
        type="number"
        className="bg-transparent text-center flex-1 w-full"
        value={value}
        onChange={handleChange}
        {...props}
      />

      <Button
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
