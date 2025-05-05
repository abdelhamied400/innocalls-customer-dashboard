"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import React from "react";
import ReactSelect, {
  components,
  Props as ReactSelectProps,
  GroupBase,
  MultiValue,
  SingleValue,
} from "react-select";
import { FixedSizeList as List } from "react-window";

const heightPerItem = 40;
const maxVisibleItems = 6;

type SmartSelectProps<OptionType> = {
  options: OptionType[];
  value: OptionType | OptionType[] | null;
  onChange: (value: OptionType | OptionType[] | null) => void;
  isMulti?: boolean;
  isVirtualized?: boolean;
  showSelectedTags?: boolean;

  // Custom option access
  getOptionLabel?: (option: OptionType) => string;
  getOptionValue?: (option: OptionType) => string | number;

  // UI
  placeholder?: string;
  label?: string;
  labelAlign?: "start" | "center" | "end";
  error?: string;
  hint?: string;
  isDisabled?: boolean;
} & Partial<
  Omit<
    ReactSelectProps<OptionType, boolean, GroupBase<OptionType>>,
    "value" | "onChange" | "options" | "isMulti"
  >
>;
const { ValueContainer, Placeholder } = components;

const SmartSelect = <OptionType extends unknown>({
  options,
  value,
  onChange,
  isMulti = false,
  isVirtualized = false,
  showSelectedTags = true,

  getOptionLabel = (opt: any) => (opt?.label ?? opt?.name) as string,
  getOptionValue = (opt: any) => (opt?.value ?? opt?.id) as string,

  placeholder = "Select...",
  label,
  labelAlign,
  error,
  hint,
  isDisabled,

  ...rest
}: SmartSelectProps<OptionType>) => {
  const MenuList = (props: any) => {
    const { children } = props;

    const height = Math.min(
      heightPerItem * children.length,
      heightPerItem * maxVisibleItems
    );

    return (
      <List
        height={height}
        itemCount={children.length}
        itemSize={heightPerItem}
        width="100%"
      >
        {({ index, style }) => <div style={style}>{children[index]}</div>}
      </List>
    );
  };

  return (
    <div className="smart-select space-y-2 w-full">
      <div className="relative w-full">
        <label
          className={cn(
            "field relative flex flex-col cursor-pointer",
            "bg-gray-50 hover:bg-gray-100 px-4 pt-2 pb-1.5 border rounded-xl",
            error && "border-red-500 bg-red-50 hover:bg-red-100 text-red-500"
          )}
        >
          {label && (
            <span
              className={cn(
                "block text-xs text-muted-foreground mb-1",
                error && "text-destructive",
                labelAlign === "center" && "text-center",
                labelAlign === "end" && "text-end"
              )}
            >
              {label}
            </span>
          )}

          <ReactSelect<OptionType, boolean>
            {...rest}
            options={options}
            value={value as any}
            onChange={(val) => onChange(val as any)}
            isMulti={isMulti}
            isDisabled={isDisabled}
            placeholder={placeholder}
            openMenuOnFocus
            getOptionLabel={getOptionLabel}
            getOptionValue={getOptionValue}
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
            components={{
              IndicatorSeparator: () => null,
              ...(isVirtualized && { MenuList }),
              ...(isMulti && {
                SingleValue: () => null,
                ...(showSelectedTags && { MultiValue: () => null }),
                ValueContainer: ({
                  children,
                  hasValue,
                  className,
                  ...props
                }) => (
                  <ValueContainer
                    hasValue={hasValue}
                    className={cn(
                      "text-gray-500 pointer-events-auto",
                      className
                    )}
                    {...props}
                  >
                    {showSelectedTags && hasValue && (
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
              }),
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

      {/* Multi-select badges */}
      {isMulti &&
        showSelectedTags &&
        Array.isArray(value) &&
        value.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {value.map((item) => (
              <Badge
                key={getOptionValue(item)}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {getOptionLabel(item)}
                <Button
                  type="button"
                  variant="unstyled"
                  size="icon"
                  className="h-4 w-4"
                  onClick={() => {
                    const newValue = value.filter(
                      (v) => getOptionValue(v) !== getOptionValue(item)
                    );
                    onChange(newValue.length ? newValue : null);
                  }}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}
    </div>
  );
};

export default SmartSelect;
