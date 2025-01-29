import { MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "./button";

type SpinButtonProps = {
  value: number;
  onChange: (e: number) => void;
  step?: number;
};

const SpinButton = ({ value, onChange, ...props }: SpinButtonProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    onChange(newValue);
  };

  return (
    <div className="flex items-center gap-1 flex-1">
      <Button size="icon" variant="outline" type="button">
        <MinusIcon />
      </Button>

      <input
        type="number"
        className="bg-transparent text-center flex-1 w-full"
        value={value}
        onChange={handleChange}
        {...props}
      />

      <Button size="icon" variant="outline" type="button">
        <PlusIcon />
      </Button>
    </div>
  );
};

export default SpinButton;
