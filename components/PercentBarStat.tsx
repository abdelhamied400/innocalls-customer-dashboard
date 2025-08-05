import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const percentBarVariants = cva("h-2 rounded-full transition-all", {
  variants: {
    color: {
      green: "bg-green-500",
      orange: "bg-orange-500",
      red: "bg-red-500",
      blue: "bg-blue-500",
      primary: "bg-primary-500",
      yellow: "bg-yellow-500",
      purple: "bg-purple-500",
      indigo: "bg-indigo-500",
    },
    size: {
      sm: "h-1.5",
      md: "h-2",
      lg: "h-3",
    },
  },
  defaultVariants: {
    color: "green",
    size: "md",
  },
});

const percentBarIndicatorVariants = cva("w-3 h-3 rounded-full transition-all", {
  variants: {
    color: {
      green: "bg-green-500",
      orange: "bg-orange-500",
      red: "bg-red-500",
      blue: "bg-blue-500",
      primary: "bg-primary-500",
      yellow: "bg-yellow-500",
      purple: "bg-purple-500",
      indigo: "bg-indigo-500",
    },
    size: {
      sm: "w-2 h-2",
      md: "w-3 h-3",
      lg: "w-4 h-4",
    },
  },
  defaultVariants: {
    color: "green",
    size: "md",
  },
});

const percentBarContainerVariants = cva("space-y-3", {
  variants: {
    spacing: {
      tight: "space-y-2",
      normal: "space-y-3",
      loose: "space-y-4",
    },
  },
  defaultVariants: {
    spacing: "normal",
  },
});

type PercentBarStatProps = VariantProps<typeof percentBarVariants> &
  VariantProps<typeof percentBarContainerVariants> & {
    label: string;
    value: string | number;
    percentage: number;
    showPercentage?: boolean;
    className?: string;
    barClassName?: string;
  };

const PercentBarStat = ({
  label,
  value,
  percentage,
  showPercentage = true,
  color = "green",
  size = "md",
  spacing = "normal",
  className = "",
  barClassName = "",
}: PercentBarStatProps) => {
  return (
    <div className={cn(percentBarContainerVariants({ spacing }), className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={cn(percentBarIndicatorVariants({ color, size }))}
          ></div>
          <span className="text-sm text-gray-600">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-800">{value}</span>
          {showPercentage && (
            <span className="text-xs text-gray-500">
              {" "}
              ({percentage}
              {String.fromCharCode(8206)}%)
            </span>
          )}
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={cn(percentBarVariants({ color, size }), barClassName)}
          style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

export default PercentBarStat;
