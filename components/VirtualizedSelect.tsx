"use client";

import { Children, useMemo } from "react";
import { Option } from "react-day-picker";
import Select, {
  Props as SelectProps,
  GroupBase,
  MenuListProps,
  OnChangeValue,
  ActionMeta,
  components as Components,
  StylesConfig,
} from "react-select";
import { FixedSizeList as List } from "react-window";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Close } from "@mui/icons-material";
import React from "react";
import { cn } from "@/lib/utils";
import Field from "./ui/field";

type Option = {
  label: string;
  value: string | number;
};

type VirtualizedSelectProps<
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
  hint?: string;
  isVirtualized?: boolean;
  noOptionsMessage?: string;
} & Omit<
  SelectProps<OptionType, IsMulti, GroupBase<OptionType>>,
  "options" | "noOptionsMessage"
>;

const MenuList = <OptionType extends Option>({
  children,
}: MenuListProps<OptionType>) => {
  const ITEM_HEIGHT = 40;
  const itemCount = Children.count(children);
  const MENU_LIST_MAX_HEIGHT = Math.min(300, itemCount * ITEM_HEIGHT);

  return (
    <List
      width="100%"
      height={MENU_LIST_MAX_HEIGHT}
      itemSize={ITEM_HEIGHT}
      itemCount={itemCount}
    >
      {({ index, style }) => (
        <div style={style}>{Children.toArray(children)[index]}</div>
      )}
    </List>
  );
};

const VirtualizedSelect = <
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
  hint,
  noOptionsMessage,
  styles: customStyles,
  ...props
}: VirtualizedSelectProps<OptionType, IsMulti>) => {
  // memoize options for performance
  const memoizedOptions = useMemo(() => options, [options]);

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

  const mergedStyles: StylesConfig<
    OptionType,
    IsMulti,
    GroupBase<OptionType>
  > = {
    control: (base, state) => {
      const defaultStyles = {
        ...base,
        backgroundColor: "transparent",
        border: 0,
        padding: 0,
        boxShadow: "none",
        "&:hover": {
          borderColor: "hsl(var(--input))",
        },
      };

      return customStyles?.control
        ? customStyles.control(defaultStyles, state)
        : defaultStyles;
    },
    valueContainer: (base, state) => {
      const defaultStyles = {
        ...base,
        padding: 0,
      };

      return customStyles?.valueContainer
        ? customStyles.valueContainer(defaultStyles, state)
        : defaultStyles;
    },
    input: (base, state) => {
      const defaultStyles = {
        ...base,
        color: "hsl(var(--foreground))",
      };

      return customStyles?.input
        ? customStyles.input(defaultStyles, state)
        : defaultStyles;
    },
    placeholder: (base, state) => {
      const defaultStyles = {
        ...base,
        display: "none",
      };

      return customStyles?.placeholder
        ? customStyles.placeholder(defaultStyles, state)
        : defaultStyles;
    },
    menu: (base, state) => {
      const defaultStyles = {
        ...base,
        zIndex: 9999,
      };

      return customStyles?.menu
        ? customStyles.menu(defaultStyles, state)
        : defaultStyles;
    },
    menuPortal: (base, state) => {
      const defaultStyles = {
        ...base,
        zIndex: 99999,
      };

      return customStyles?.menuPortal
        ? customStyles.menuPortal(defaultStyles, state)
        : defaultStyles;
    },
  };

  return (
    <div className={cn("select", className)}>
      <Field label={label} error={error} hint={hint}>
        <Select
          className="w-full"
          classNamePrefix="virtualized-select"
          options={memoizedOptions}
          isSearchable={isSearchable}
          placeholder={placeholder}
          isMulti={isMulti}
          components={{
            MenuList,
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
                      <span className="text-muted-foreground absolute pointer-events-none">
                        {placeholder}
                      </span>
                    )}
                    {children}
                  </div>
                </Components.ValueContainer>
              );
            },
          }}
          styles={mergedStyles}
          noOptionsMessage={
            noOptionsMessage ? () => noOptionsMessage : undefined
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

export default VirtualizedSelect;
