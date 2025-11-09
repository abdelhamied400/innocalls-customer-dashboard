// components/ui/SmartSelect.tsx
"use client";

import React, { Children, useMemo } from "react";
import CreatableSelect from "react-select/creatable";
import Select, {
  components as defaultComponents,
  MenuListProps,
  Props as SelectProps,
} from "react-select";
import { FixedSizeList as List } from "react-window";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

type SmartSelectProps<Option, IsMulti extends boolean = false> = {
  /** The options array (can have any shape, not only label/value) */
  options: Option[];

  /** Called when value changes */
  onChange: (value: IsMulti extends true ? Option[] : Option | null) => void;

  /** Controlled value */
  value: IsMulti extends true ? Option[] : Option | null;

  /** Extract label and value fields from custom option shape */
  getOptionLabel: (option: Option) => string;
  getOptionValue: (option: Option) => string;

  /** Show multiple selection */
  isMulti?: IsMulti;

  /** Allow creating new options */
  isCreatable?: boolean;

  /** Enable menu portal (good for modals, drawers) */
  menuPortalTarget?: HTMLElement | null;

  /** Custom label */
  label?: string;

  /** Class names for container */
  className?: string;
};

/**
 * SmartSelect — a unified, type-safe select component supporting:
 * - Single / Multi Select
 * - Virtualized or not based on option count
 * - Creatable / Non-creatable modes
 * - Portalled menu
 */
export function SmartSelect<Option, IsMulti extends boolean = false>({
  options,
  onChange,
  value,
  getOptionLabel,
  getOptionValue,
  isMulti,
  isCreatable,
  menuPortalTarget,
  label,
  className,
}: SmartSelectProps<Option, IsMulti>) {
  const SelectComponent = isCreatable ? CreatableSelect : Select;

  const isVirtualized = options.length > 50;

  const customComponents = useMemo(() => {
    if (!isVirtualized) return undefined;

    // Custom virtualized MenuList
    const MenuList = (props: MenuListProps<Option, IsMulti>) => {
      const { options, children, maxHeight } = props;
      const height = Math.min(maxHeight, options.length * 35);
      const childrenArray = Children.toArray(children);

      return (
        <List
          height={height}
          itemCount={childrenArray.length}
          itemSize={35}
          width="100%"
        >
          {({ index, style }) => (
            <div style={style}>{childrenArray[index]}</div>
          )}
        </List>
      );
    };

    return { ...defaultComponents, MenuList };
  }, [isVirtualized]);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <Label className="text-sm font-medium">{label}</Label>}
      <Card className="border border-input bg-background p-0">
        <SelectComponent<Option, IsMulti>
          classNamePrefix="smart-select"
          options={options}
          value={value}
          onChange={(val) =>
            onChange(val as IsMulti extends true ? Option[] : Option | null)
          }
          getOptionLabel={getOptionLabel}
          getOptionValue={getOptionValue}
          isMulti={isMulti}
          menuPortalTarget={menuPortalTarget}
          menuPosition={menuPortalTarget ? "fixed" : "absolute"}
          components={customComponents}
          styles={{
            control: (base) => ({
              ...base,
              border: "none",
              boxShadow: "none",
              background: "transparent",
            }),
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isSelected
                ? "hsl(var(--primary))"
                : state.isFocused
                ? "hsl(var(--accent))"
                : "transparent",
              color: state.isSelected
                ? "hsl(var(--primary-foreground))"
                : "inherit",
              cursor: "pointer",
            }),
          }}
        />
      </Card>
    </div>
  );
}
