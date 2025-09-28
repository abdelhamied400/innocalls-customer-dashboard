"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";
import { useLocale } from "@/providers/TranslationProvider";
import { locales } from "@/i18n/config";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => {
  const localeSlug = useLocale();
  const dir = locales[localeSlug]?.dir || "ltr";

  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex h-8 w-16 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-success-300 data-[state=unchecked]:bg-input",
        className
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block h-7 w-10 rounded-full bg-white ring-0 transition-transform data-[state=unchecked]:translate-x-0",
          dir === "rtl"
            ? "data-[state=checked]:-translate-x-5"
            : "data-[state=checked]:translate-x-5"
        )}
      />
    </SwitchPrimitives.Root>
  );
});
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
