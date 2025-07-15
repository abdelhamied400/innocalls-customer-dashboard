import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva(
  "border border-transparent p-2 rounded-lg transition-colors",
  {
    variants: {
      color: {
        success: "bg-green-100/50 hover:bg-green-100/70 hover:border-green-500",
        warning:
          "bg-warning-100/50 hover:bg-warning-100/70 hover:border-warning-500",
      },
    },
    defaultVariants: {
      color: "success",
    },
  }
);

const indicatorVariants = cva("block w-2 h-2 rounded-full", {
  variants: {
    color: {
      success: "bg-green-500",
      warning: "bg-warning-500",
    },
  },
});

const textVariants = cva("text-xs font-bold", {
  variants: {
    color: {
      success: "text-green-500",
      warning: "text-warning-500",
    },
  },
});

const numberVariants = cva("", {
  variants: {
    color: {
      success: "text-green-500",
      warning: "text-warning-500",
    },
  },
});

interface QueueSummaryStatsCardProps extends VariantProps<typeof cardVariants> {
  label: string;
  count: number;
  unit: string;
}

const QueueSummaryStatsCard = ({
  color = "success",
  label,
  count,
  unit,
}: QueueSummaryStatsCardProps) => {
  return (
    <div className={cardVariants({ color })}>
      <div className="head flex items-center gap-1">
        <span className={indicatorVariants({ color })}></span>
        <p className={textVariants({ color })}>{label}</p>
      </div>
      <h2 className={numberVariants({ color })}>{count}</h2>
      <p className="text-xs">{unit}</p>
    </div>
  );
};

export default QueueSummaryStatsCard;
