import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center px-4 py-1 border rounded-full text-sm focus:ring-2 focus:ring-ring focus:ring-offset-2 font-semibold capitalize transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "bg-primary-100 text-primary-500 hover:bg-primary-200",
        info: "border-transparent bg-blue-100 text-blue-700 hover:bg-blue-200",
        primary:
          "border-transparent bg-primary-100 text-primary-700 hover:bg-primary-200",
        secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 border-0",
        destructive:
          "border-transparent bg-destructive-200 text-destructive hover:bg-destructive-200/80",
        outline: "text-foreground",
        warning:
          "border-transparent bg-warning-100 text-warning-500 hover:bg-warning-200",
        muted: "border-transparent bg-gray-100 text-gray-500 hover:bg-gray-200",
        neutral:
          "border-transparent bg-neutral-200 text-neutral-700 hover:bg-neutral-300",
        gray: "border-transparent bg-neutral-500 text-neutral-50 hover:bg-neutral-500",
        success:
          "border-transparent bg-success-100 text-success-500 hover:bg-success-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
export type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
