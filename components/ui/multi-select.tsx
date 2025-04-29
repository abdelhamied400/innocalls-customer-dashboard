"use client";

import ReactSelect, {
  Props as SelectPropsLib,
  GroupBase,
  components,
  MultiValue,
  SingleValue,
} from "react-select";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Button } from "./button";

type DefaultOptionKeys = {
  id: string;
  name: string;
};

const { ValueContainer, Placeholder } = components;

type MultiSelectProps<T> = {
  options: T[];
  placeholder?: string;
  value: MultiValue<T> | SingleValue<T> | null;
  onChange: (value: MultiValue<T> | SingleValue<T> | null) => void;
  label?: string;
  labelAlign?: "start" | "center" | "end";
  error?: string;
  hint?: string;
  getOptionLabel?: (option: T) => string;
  getOptionValue?: (option: T) => string | number;
} & Partial<Pick<SelectPropsLib<T, boolean, GroupBase<T>>, "isDisabled">>;
const MultiSelect = <T extends DefaultOptionKeys>({
  options,
  placeholder = "Select...",
  value,
  onChange,
  isDisabled,
  label,
  labelAlign,
  error,
  hint,
  getOptionLabel = (option) => option.name,
  getOptionValue = (option) => option.id,
}: MultiSelectProps<T>) => {
  return (
    <div className="multi-select space-y-2 w-full">
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
            isMulti={true}
            value={value}
            onChange={onChange}
            isDisabled={isDisabled}
            placeholder={placeholder}
            openMenuOnFocus
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option.id}
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
              SingleValue: () => null,
              MultiValue: () => null,
              ValueContainer: ({ children, hasValue, className, ...props }) => (
                <ValueContainer
                  hasValue={hasValue}
                  className={cn("text-gray-500 pointer-events-auto", className)}
                  {...props}
                >
                  {hasValue && (
                    <Placeholder
                      data-placeholder={placeholder}
                      isFocused={false}
                      hasValue={hasValue}
                      innerProps={{ className: "font-bold text-black" }}
                      {...props}
                    >
                      {placeholder}
                    </Placeholder>
                  )}

                  {children}
                </ValueContainer>
              ),
              ClearIndicator: () => null,
              IndicatorSeparator: () => null,
            }}
            theme={(theme) => ({
              ...theme,
              borderRadius: 6,
              colors: {
                ...theme.colors,
                primary: "hsl(var(--primary))",
                primary25: "hsl(var(--muted))",
              },
            })}
          />
        </label>
        {hint && <p className="text-muted-foreground text-xs">{hint}</p>}
        {error && <p className="text-destructive text-xs">{error}</p>}
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.isArray(value) &&
          value.map((v) => (
            <Badge
              key={getOptionValue(v)}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {getOptionLabel(v)}
              <Button
                size="icon"
                variant="unstyled"
                type="button"
                onClick={() => {
                  const newValue = value.filter(
                    (item) => getOptionValue(item) !== getOptionValue(v)
                  );
                  onChange(newValue.length > 0 ? newValue : null);
                }}
                className="h-4 w-4"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
      </div>
    </div>
  );
};

export default MultiSelect;
