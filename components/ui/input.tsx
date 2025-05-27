"use client";
import * as React from "react";

import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { Button } from "./button";
import { Eye, EyeOff } from "lucide-react";

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
    const [showPassword, setShowPassword] = React.useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className={cn("relative", "flex-1")}>
        <input
          type={showPassword ? "text" : type} // Toggle between "text" and original type
          className={cn(
            inputVariants({ variant, className }),
            type === "password" && "pe-10"
          )}
          ref={ref}
          {...props}
        />
        {type === "password" && (
          <Button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center px-2 focus:outline-none"
            variant="unstyled"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <Eye /> : <EyeOff />}
          </Button>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
