"use client";

import { Option } from "react-day-picker";
import ReactSelect, {
  Props as ReactSelectProps,
  GroupBase,
  components as Components,
  OnChangeValue,
  ActionMeta,
} from "react-select";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Close } from "@mui/icons-material";
import React from "react";
import { cn } from "@/lib/utils";
import Field from "./ui/field";
import { useTranslations } from "@/providers/TranslationProvider";

export type Option = {
  label: string;
  value: string | number;
};

type SelectProps<
  OptionType extends Option = Option,
  IsMulti extends boolean = false,
> = {
  options: OptionType[];
  isMulti?: IsMulti;
  isSearchable?: boolean;
  placeholder?: string;
  className?: string;
  label?: string;
  error?: string;
  noOptionsMessage?: string;
} & Omit<
  ReactSelectProps<OptionType, IsMulti, GroupBase<OptionType>>,
  "options" | "noOptionsMessage"
>;

const Select = <
  OptionType extends Option = Option,
  IsMulti extends boolean = false,
>({
  options,
  isSearchable = true,
  placeholder = "Select...",
  className,
  isMulti,
  onChange,
  label,
  error,
  noOptionsMessage,
  ...props
}: SelectProps<OptionType, IsMulti>) => {
  const tCommon = useTranslations("common");
  const noOptionsDefaultMessage = tCommon("select.noOptionsMessage");

  const onRemoveOption = (val: OptionType) => {
    if (isMulti && props.value && Array.isArray(props.value)) {
      const newValue = props.value.filter(
        (option: OptionType) => option.value !== val.value,
      ) as readonly OptionType[];
      if (onChange) {
        onChange(
          newValue as OnChangeValue<OptionType, IsMulti>,
          {
            action: "remove-value",
            removedValue: val,
          } as ActionMeta<OptionType>,
        );
      }
    }
  };

  return (
    <div className={cn("select", className)}>
      <Field label={label} error={error}>
        <ReactSelect
          className="w-full"
          classNamePrefix="select"
          options={options}
          isSearchable={isSearchable}
          placeholder={placeholder}
          isMulti={isMulti}
          components={{
            IndicatorSeparator: () => <></>,
            MultiValue: () => <></>,
            ValueContainer: ({ children, ...innerProps }) => {
              const inputValue = (
                innerProps as { selectProps: { inputValue: string } }
              ).selectProps.inputValue;
              // For multi-select, always show placeholder when no input
              // For single-select, hide placeholder when value is selected
              const showPlaceholder = isMulti
                ? !inputValue
                : !inputValue && !innerProps.hasValue;

              return (
                <Components.ValueContainer {...innerProps}>
                  <div className="flex items-center w-full relative">
                    {showPlaceholder && (
                      <span className="text-muted-foreground font-normal text-sm absolute pointer-events-none">
                        {placeholder}
                      </span>
                    )}
                    {children}
                  </div>
                </Components.ValueContainer>
              );
            },
          }}
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: "transparent",
              border: 0,
              padding: 0,
              boxShadow: "none",
              "&:hover": {
                borderColor: "hsl(var(--input))",
              },
            }),
            valueContainer: (base) => ({
              ...base,
              padding: 0,
            }),
            input: (base) => ({
              ...base,
              color: "hsl(var(--foreground))",
            }),
            placeholder: (base) => ({
              ...base,
              display: "none", // hide react-select's internal placeholder
            }),
            menu: (base) => ({
              ...base,
              zIndex: 9999,
            }),
            menuPortal: (base) => ({
              ...base,
              zIndex: 99999,
            }),
            menuList: (base) => ({
              ...base,
              maxHeight: 200,
            }),
          }}
          noOptionsMessage={
            noOptionsMessage
              ? () => noOptionsMessage
              : () => noOptionsDefaultMessage
          }
          onChange={onChange}
          {...props}
        />
      </Field>
      {isMulti && (
        <div className="select__tags flex items-center gap-1 flex-wrap mt-2">
          {props.value &&
            Array.isArray(props.value) &&
            props.value.map((val) => (
              <Badge
                key={val.value}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {val.label}
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-6 bg-transparent"
                  onClick={() => onRemoveOption(val)}
                >
                  <Close />
                </Button>
              </Badge>
            ))}
        </div>
      )}
    </div>
  );
};

export default Select;
