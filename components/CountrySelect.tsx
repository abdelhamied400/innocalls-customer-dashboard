"use client";

import React from "react";
import Select, { components, SingleValueProps } from "react-select";
import { FixedSizeList as List } from "react-window";
import { countries, CountryOption } from "@/constants/countries";

// Single value display (selected country)
const customSingleValue = (props: SingleValueProps<CountryOption>) => (
  <components.SingleValue {...props}>
    <span className="flex items-center gap-2">
      <span>{props.data.flag}</span>
      <span>{props.data.label}</span>
    </span>
  </components.SingleValue>
);

// Option in dropdown list
const customOption = (props: any) => (
  <components.Option {...props}>
    <div className="flex items-center gap-2">
      <span>{props.data.flag}</span>
      <span>{props.data.label}</span>
    </div>
  </components.Option>
);

const MenuList = (props: any) => {
  const { options, children, maxHeight, getValue } = props;
  const [value] = getValue();
  const ITEM_HEIGHT = 40;
  const itemCount = children.length;
  const initialOffset = options.indexOf(value) * ITEM_HEIGHT;

  const outerRef = React.useRef<HTMLDivElement | null>(null);

  return (
    <components.MenuList
      {...props}
      innerRef={outerRef}
      innerProps={{
        ...props.innerProps,
        style: {
          ...props.innerProps.style,
          overflow: "hidden", // still needed to hide outer bar
        },
      }}
    >
      {itemCount === 0 ? (
        <div className="p-2 text-sm text-muted-foreground text-center">
          No countries found
        </div>
      ) : (
        <List
          outerRef={outerRef}
          height={
            itemCount > 0
              ? Math.min(maxHeight, itemCount * ITEM_HEIGHT)
              : ITEM_HEIGHT
          }
          itemCount={itemCount}
          itemSize={ITEM_HEIGHT}
          initialScrollOffset={initialOffset}
          width="100%"
        >
          {({ index, style }) => <div style={style}>{children[index]}</div>}
        </List>
      )}
    </components.MenuList>
  );
};

const CountrySelect = ({
  value,
  onChange,
}: {
  value?: CountryOption;
  onChange?: (value?: CountryOption) => void;
}) => {
  const handleChange = (newValue: CountryOption | null) => {
    onChange?.(newValue ?? undefined);
  };

  return (
    <div className="space-y-2">
      <Select
        className="react-select-container"
        classNamePrefix="react-select"
        options={countries}
        value={value}
        isClearable
        placeholder="Select a country..."
        isMulti={false}
        onChange={handleChange}
        components={{
          Option: customOption,
          SingleValue: customSingleValue,
          MenuList,
        }}
        styles={{
          control: (base) => ({
            ...base,
            borderRadius: "0.5rem",
            padding: "0.25rem 0.5rem",
            borderColor: "#e5e7eb",
            boxShadow: "none",
          }),
        }}
      />
    </div>
  );
};

export default CountrySelect;
