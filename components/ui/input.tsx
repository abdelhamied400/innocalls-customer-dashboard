import * as React from "react";

import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const inputVariants = cva(
  "flex file:border-0 bg-transparent file:bg-transparent disabled:opacity-50 px-3 py-1 border rounded-md w-full h-9 file:font-medium file:text-foreground file:text-sm md:text-sm placeholder:text-muted-foreground transition-colors disabled:cursor-not-allowed focus-visible:outline-0",
  {
    variants: {
      variant: {
        default: "shadow-sm border-input",
        field: "shadow-none border-0 p-0 h-8 text-xl font-bold",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
