"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import Spinner from "./spinner";

const LONG_PRESS_DURATION = 300;

const buttonVariants = cva(
  "inline-flex justify-center items-center gap-2 disabled:opacity-50 rounded-md focus-visible:ring-1 focus-visible:ring-ring font-semibold text-sm whitespace-nowrap transition-colors disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-5 focus-visible:outline-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground  hover:bg-destructive/90",
        outline:
          "border border-primary text-primary bg-background hover:bg-accent",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        success: "bg-[#34C85A] text-white hover:bg-[#34C85A]/90",
        ghost: "bg-neutral-100 text-neutral-800 hover:bg-neutral-200",
        calendar: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        "pagination-ghost":
          "rounded-full hover:bg-accent hover:text-accent-foreground",
        "pagination-active":
          "rounded-full bg-neutral-800 text-primary-foreground",
        filter:
          "bg-neutral-200 text-neutral-foreground hover:bg-neutral-300 text-xs rounded-full font-semibold",
        "ghost-primary": "bg-primary-100 hover:bg-primary-200 text-primary-500",
        "ghost-success": "bg-success-100 hover:bg-success-200 text-success-500",
        "ghost-warning": "bg-warning-100 hover:bg-warning-200 text-warning-500",
        "ghost-destructive":
          "bg-destructive-100 hover:bg-destructive-200 text-destructive-500",
        tab: "rounded-full bg-gray-100 border border-gray-100 text-gray-500 hover:bg-gray-200 active:bg-gray-200 data-[active=true]:border-primary data-[active=true]:bg-primary-100 data-[active=true]:text-primary",
        unstyled: "",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8 text-base",
        icon: "h-10 w-10",
        filter: "h-8 px-4 py-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  onLongPress?: () => void;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      children,
      loading,
      onLongPress,
      onClick,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    const timerRef = React.useRef<NodeJS.Timeout | null>(null);
    const longPressTriggeredRef = React.useRef(false);

    const handleMouseDown = () => {
      longPressTriggeredRef.current = false;
      timerRef.current = setTimeout(() => {
        longPressTriggeredRef.current = true;
        onLongPress?.();
      }, LONG_PRESS_DURATION);
    };

    const handleMouseUp = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (longPressTriggeredRef.current) return;
      onClick?.(e);
    };

    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size }), className)}
          ref={ref}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          onClick={handleClick}
          {...props}
        >
          {children}
        </Comp>
      );
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        onClick={handleClick}
        {...props}
      >
        {loading && <Spinner />}
        {size === "icon" && loading ? "" : children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
