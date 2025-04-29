"use client";

import SelectLib, {
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
import { PropsWithChildren, ReactNode } from "react";

type DefaultOptionKeys = {
  id: string;
  name: string;
};

const { ValueContainer } = components;

const MultiSelect = ({ children }: { children: ReactNode }) => {
  return <div className="multi-select space-y-2 w-full">{children}</div>;
};

type MultiSelectFieldProps = PropsWithChildren<{
  label?: string;
  error?: string;
}>;
export const MultiSelectField = ({
  children,
  label,
  error,
}: MultiSelectFieldProps) => {
  return (
    <div className="field flex flex-col gap-1 cursor-pointer">
      <label className="flex flex-col bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100">
        {label && (
          <label className="text-sm font-medium text-gray-700">{label}</label>
        )}
        {children}
      </label>
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );
};

type MultiSelectTriggerProps<T> = {
  options: T[];
  isMulti?: boolean;
  placeholder?: string;
  value: MultiValue<T> | SingleValue<T> | null;
  onChange: (value: MultiValue<T> | SingleValue<T> | null) => void;
} & Partial<Pick<SelectPropsLib<T, boolean, GroupBase<T>>, "isDisabled">>;
export const MultiSelectTrigger = <T extends DefaultOptionKeys>({
  options,
  isMulti = false,
  placeholder = "Select...",
  value,
  onChange,
  isDisabled,
}: MultiSelectTriggerProps<T>) => {
  return (
    <div className="relative w-full">
      <SelectLib
        options={options}
        isMulti={isMulti}
        value={value}
        onChange={onChange}
        isDisabled={isDisabled}
        placeholder={placeholder}
        getOptionLabel={(option) => option.name}
        getOptionValue={(option) => option.id}
        classNames={{
          control: ({ isFocused }) => cn("control"),
          valueContainer: () => "value-container", // Hide inside value completely
          indicatorsContainer: () =>
            "absolute right-2 top-1/2 -translate-y-1/2 pointer-events-auto", // Chevron clickable
          menu: () => "bg-popover border rounded-md mt-1 text-sm shadow-md",
          option: ({ isFocused, isSelected }) =>
            cn(
              "px-3 py-2 cursor-pointer",
              isFocused && "bg-muted",
              isSelected && "bg-primary text-primary-foreground"
            ),
        }}
        components={{
          SingleValue: () => null,
          MultiValue: () => null,
          ValueContainer: ({ children, hasValue, className, ...props }) => (
            <ValueContainer
              hasValue={hasValue}
              className={cn("text-gray-500", className)}
              {...props}
            >
              {hasValue ? ` ${placeholder}` : children}
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
    </div>
  );
};

type MultiSelectValueProps<T> = {
  value: MultiValue<T> | SingleValue<T> | null;
  onChange: (value: MultiValue<T> | SingleValue<T> | null) => void;
  isMulti?: boolean;
  getOptionLabel?: (option: T) => string;
  getOptionValue?: (option: T) => string | number;
};
export const MultiSelectValue = <T extends DefaultOptionKeys>({
  value,
  onChange,
  isMulti,
  getOptionLabel = (option) => option.name,
  getOptionValue = (option) => option.id,
}: MultiSelectValueProps<T>) => {
  const handleRemove = (itemToRemove: T) => {
    if (isMulti && Array.isArray(value)) {
      const newValue = value.filter(
        (v) => getOptionValue(v) !== getOptionValue(itemToRemove)
      );
      onChange(newValue.length > 0 ? newValue : null);
    } else {
      onChange(null);
    }
  };

  if (!value) return null;

  if (Array.isArray(value)) {
    return (
      <div className="flex flex-wrap gap-2">
        {value.map((v) => (
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
              onClick={() => handleRemove(v)}
              className="h-4 w-4"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
    );
  }

  return (
    <Badge variant="secondary" className="flex items-center gap-1">
      {getOptionLabel(value as T)}
      <Button
        size="icon"
        variant="unstyled"
        type="button"
        onClick={() => handleRemove(value as T)}
        className="h-4 w-4"
      >
        <X className="h-3 w-3" />
      </Button>
    </Badge>
  );
};

export default MultiSelect;
