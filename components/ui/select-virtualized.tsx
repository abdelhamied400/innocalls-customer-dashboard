import { cn } from "@/lib/utils";
import React from "react";
import Select, { Props as SelectProps, SingleValue } from "react-select";
import { FixedSizeList as List } from "react-window";

type DefaultOption = {
  label: string;
  value: string;
};

const heightPerItem = 40;
const maxVisibleItems = 6;

type VirtualizedSelectProps<OptionType> = {
  options: OptionType[];
  placeholder?: string;
  value: SingleValue<OptionType> | null;
  onChange: (value: SingleValue<OptionType> | null) => void;
  label?: string;
  labelAlign?: "start" | "center" | "end";
  error?: string;
  hint?: string;
  getLabel?: (option: OptionType) => string;
  getValue?: (option: OptionType) => string;
} & Omit<
  SelectProps<OptionType, false>,
  "options" | "getOptionLabel" | "getOptionValue"
>;

export const VirtualizedSelect = <OptionType = DefaultOption,>({
  options,
  placeholder = "Select...",
  value,
  onChange,
  isDisabled,
  label,
  labelAlign,
  error,
  hint,
  getLabel,
  getValue,
  ...rest
}: VirtualizedSelectProps<OptionType>) => {
  const getOptionLabel = getLabel ?? ((opt: any) => opt.label);
  const getOptionValue = getValue ?? ((opt: any) => opt.value);

  const MenuList = (props: any) => {
    const { options, children, getValue, selectProps } = props;

    const height = Math.min(
      heightPerItem * options.length,
      heightPerItem * maxVisibleItems
    );

    const selectedValue = getValue()[0];
    const selectedIndex = options.findIndex(
      (opt: any) =>
        selectProps.getOptionValue(opt) ===
        selectProps.getOptionValue(selectedValue)
    );

    const initialOffset =
      selectedIndex > -1 ? selectedIndex * heightPerItem : 0;

    return (
      <List
        height={height}
        itemCount={children.length}
        itemSize={heightPerItem}
        initialScrollOffset={initialOffset}
        width="100%"
      >
        {({ index, style }) => <div style={style}>{children[index]}</div>}
      </List>
    );
  };

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
          <Select<OptionType, false>
            {...rest}
            value={value}
            onChange={onChange}
            isDisabled={isDisabled}
            options={options}
            openMenuOnFocus
            placeholder={placeholder}
            getOptionLabel={getOptionLabel}
            getOptionValue={getOptionValue}
            components={{ MenuList, IndicatorSeparator: () => null }}
            classNames={{
              control: () => "control",
              valueContainer: () => "value-container",
              indicatorsContainer: () =>
                "absolute right-2 top-1/2 -translate-y-1/2 pointer-events-auto",
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
          />
        </label>
        {hint && <p className="text-muted-foreground text-xs">{hint}</p>}
        {error && <p className="text-destructive text-xs">{error}</p>}
      </div>
    </div>
  );
};
