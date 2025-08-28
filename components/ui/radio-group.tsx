"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";

import { cn } from "@/lib/utils";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square size-7 rounded-full border border-neutral-600 text-neutral-600 shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="size-6 fill-primary stroke-none" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

type RadioGroupField = React.PropsWithChildren<{
  htmlFor?: string;
  label?: string;
  error?: string;
  preIcon?: React.ReactNode;
  hint?: string;
}>;
const RadioGroupField = ({
  label,
  error,
  preIcon,
  children,
  hint,
  htmlFor,
  ...props
}: RadioGroupField) => {
  return (
    <div className="field">
      <label
        className="relative flex flex-col gap-1 cursor-pointer"
        htmlFor={htmlFor}
      >
        <div
          className={cn(
            "bg-gray-50 hover:bg-gray-100 p-4 border rounded-xl flex flex-col lg:flex-row justify-between items-center gap-2",
            error && "border-red-500 bg-red-50 hover:bg-red-100 text-red-500"
          )}
          {...props}
        >
          {label && (
            <h4 className={cn("block", error && "text-red-500")}>{label}</h4>
          )}
          <div className="flex items-center gap-1">
            {preIcon}
            {children}
          </div>
        </div>
      </label>

      {hint && <p className="text-muted-foreground text-xs">{hint}</p>}
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export { RadioGroup, RadioGroupItem, RadioGroupField };
