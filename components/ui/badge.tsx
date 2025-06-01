import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center px-4 py-1 border rounded-full focus:ring-2 focus:ring-ring focus:ring-offset-2 font-semibold capitalize transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "bg-primary-100 text-primary-600 hover:bg-primary-200",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        warning:
          "border-transparent bg-warning-100 text-warning-500 hover:bg-warning-200",
        muted: "border-transparent bg-gray-100 text-gray-600 hover:bg-gray-200",
        success:
          "border-transparent bg-success-100 text-success-500 hover:bg-success-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
