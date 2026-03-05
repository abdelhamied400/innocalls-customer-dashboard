import { MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

type SpinButtonProps = {
  id?: string;
  value: number;
  onChange: (val: number) => void;
  step?: number;
  htmlFor?: string;
  label?: string;
  labelAlign?: "start" | "center" | "end";
  error?: string;
  preIcon?: React.ReactNode;
  postIcon?: React.ReactNode;
  hint?: string;
};

const SpinButton = ({
  value = 0,
  onChange,
  step = 1,
  id,
  label,
  labelAlign = "center",
  error,
  preIcon,
  postIcon,
  hint,
  ...props
}: SpinButtonProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    onChange(newValue);
  };

  const handleIncrement = () => {
    const newValue = value + step;
    onChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = value - step;
    onChange(newValue);
  };

  return (
    <div className="spin-button flex-1">
      <label
        htmlFor={id}
        className={cn(
          "relative cursor-pointer flex items-center gap-1 p-2 border rounded-xl",
          "bg-gray-100 hover:bg-gray-200 ",
          error && "border-red-500 bg-red-50 hover:bg-red-100 text-red-500"
        )}
      >
        <Button
          size="icon"
          variant="outline"
          type="button"
          className="size-6 rounded-sm border-stroke text-icons"
          onClick={handleDecrement}
        >
          <MinusIcon />
        </Button>

        <div className="flex flex-col gap-1 flex-1">
          {label && (
            <span
              className={cn(
                "block text-xs text-muted-foreground",
                error && "text-red-500",
                labelAlign === "center" && "text-center",
                labelAlign === "end" && "text-end"
              )}
            >
              {label}
            </span>
          )}
          <input
            type="number"
            className="bg-transparent text-center flex-1 w-full outline-none"
            value={value}
            onChange={handleChange}
            id={id}
            {...props}
          />
        </div>

        <Button
          size="icon"
          variant="outline"
          type="button"
          className="size-6 rounded-sm border-stroke text-icons"
          onClick={handleIncrement}
        >
          <PlusIcon />
        </Button>
      </label>

      {hint && <p className="text-muted-foreground text-xs">{hint}</p>}
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default SpinButton;
