"use client";

import ReactSelect, {
  Props as SelectPropsLib,
  GroupBase,
  SingleValue,
} from "react-select";
import { cn } from "@/lib/utils";

type SelectProps<T> = {
  options: T[];
  placeholder?: string;
  value: SingleValue<T> | null;
  onChange: (value: SingleValue<T> | null) => void;
  label?: string;
  labelAlign?: "start" | "center" | "end";
  error?: string;
  hint?: string;
  getOptionLabel?: (option: T) => string;
  getOptionValue?: (option: T) => string;
} & Partial<Pick<SelectPropsLib<T, boolean, GroupBase<T>>, "isDisabled">>;

const Select = <T extends unknown>({
  options,
  placeholder = "Select...",
  value,
  onChange,
  isDisabled,
  label,
  labelAlign,
  error,
  hint,
  getOptionLabel = (option: any) => option.name,
  getOptionValue = (option: any) => option.id,
}: SelectProps<T>) => {
  return (
    <div className="select space-y-2 w-full">
      <div className="relative w-full">
        <label
          className={cn(
            "field relative flex flex-col cursor-pointer",
            "bg-gray-50 hover:bg-gray-100 px-4 pt-2 pb-1.5 border rounded-xl",
            error && "border-red-500 bg-red-50 hover:bg-red-100 text-red-500"
          )}
        >
          <span
            className={cn(
              "block text-xs text-muted-foreground",
              error && "text-destructive",
              labelAlign === "center" && "text-center",
              labelAlign === "end" && "text-end"
            )}
          >
            {label}
          </span>
          <ReactSelect
            options={options}
            isMulti={false}
            value={value}
            onChange={onChange}
            isDisabled={isDisabled}
            placeholder={placeholder}
            openMenuOnFocus
            getOptionLabel={getOptionLabel}
            getOptionValue={getOptionValue}
            classNames={{
              control: () => "control",
              valueContainer: () => "value-container", // Hide inside value completely
              indicatorsContainer: () =>
                "absolute right-2 top-1/2 -translate-y-1/2 pointer-events-auto", // Chevron clickable
              menu: () =>
                "bg-popover border rounded-md mt-1 text-sm shadow-md text-gray-700",
              option: ({ isFocused, isSelected }) =>
                cn(
                  "px-3 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground",
                  isFocused && "bg-muted",
                  isSelected && "bg-primary text-primary-foreground"
                ),
              placeholder: () => "font-bold text-black",
            }}
            components={{
              IndicatorSeparator: () => null,
            }}
          />
        </label>
        {hint && <p className="text-muted-foreground text-xs">{hint}</p>}
        {error && <p className="text-destructive text-xs">{error}</p>}
      </div>
    </div>
  );
};

export default Select;
