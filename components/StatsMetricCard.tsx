import { cva, VariantProps } from "class-variance-authority";

const cardStyles = cva("p-4 rounded-lg transition-colors group", {
  variants: {
    color: {
      default:
        "bg-gradient-to-r from-gray-50 to-gray-100 group-hover:from-gray-200/20 group-hover:to-gray-200/70",
      primary:
        "bg-gradient-to-r from-primary-50 to-primary-100 group-hover:from-primary-200/20 group-hover:to-primary-200/70",
      success:
        "bg-gradient-to-r from-green-50 to-green-100 group-hover:from-green-200/20 group-hover:to-green-200/70",
      destructive:
        "bg-gradient-to-r from-red-50 to-red-100 group-hover:from-red-200/20 group-hover:to-red-200/70",
      info: "bg-gradient-to-r from-indigo-50 to-indigo-100 group-hover:from-indigo-200/20 group-hover:to-indigo-200/70",
      warning:
        "bg-gradient-to-r from-amber-50 to-amber-100 group-hover:from-amber-200/20 group-hover:to-amber-200/70",
    },
  },
  defaultVariants: {
    color: "default",
  },
});

const labelStyles = cva("text-sm font-medium transition-colors", {
  variants: {
    color: {
      default: "text-gray-700 group-hover:text-gray-800",
      primary: "text-primary-700 group-hover:text-primary-800",
      success: "text-green-700 group-hover:text-green-800",
      destructive: "text-red-700 group-hover:text-red-800",
      info: "text-indigo-700 group-hover:text-indigo-800",
      warning: "text-amber-700 group-hover:text-amber-800",
    },
  },
  defaultVariants: {
    color: "default",
  },
});

const valueStyles = cva("text-lg font-bold transition-colors", {
  variants: {
    color: {
      default: "text-gray-800 group-hover:text-gray-900",
      primary: "text-primary-800 group-hover:text-primary-900",
      success: "text-green-800 group-hover:text-green-900",
      destructive: "text-red-800 group-hover:text-red-900",
      info: "text-indigo-800 group-hover:text-indigo-900",
      warning: "text-amber-800 group-hover:text-amber-900",
    },
  },
  defaultVariants: {
    color: "default",
  },
});

const dotStyles = cva("w-3 h-3 rounded-full transition-colors", {
  variants: {
    color: {
      default: "bg-gray-500 group-hover:bg-gray-600",
      primary: "bg-primary-500 group-hover:bg-primary-600",
      success: "bg-green-500 group-hover:bg-green-600",
      destructive: "bg-red-500 group-hover:bg-red-600",
      info: "bg-indigo-500 group-hover:bg-indigo-600",
      warning: "bg-amber-500 group-hover:bg-amber-600",
    },
  },
  defaultVariants: {
    color: "default",
  },
});

const changeStyles = cva("text-xs transition-colors", {
  variants: {
    color: {
      default: "text-gray-600 group-hover:text-gray-700",
      primary: "text-primary-600 group-hover:text-primary-700",
      success: "text-green-600 group-hover:text-green-700",
      destructive: "text-red-600 group-hover:text-red-700",
      info: "text-indigo-600 group-hover:text-indigo-700",
      warning: "text-amber-600 group-hover:text-amber-700",
    },
  },
  defaultVariants: {
    color: "default",
  },
});

type StatsMetricCardProps = VariantProps<typeof cardStyles> & {
  label: string;
  value: string;
  performanceChange: string;
};

const StatsMetricCard = ({
  label,
  value,
  performanceChange,
  color = "default",
}: StatsMetricCardProps) => {
  return (
    <div className={cardStyles({ color })}>
      <div className="flex items-center justify-between mb-2">
        <span className={labelStyles({ color })}>{label}</span>
        <span className={valueStyles({ color })}>{value}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className={dotStyles({ color })}></div>
        <span className={changeStyles({ color })}>{performanceChange}</span>
      </div>
    </div>
  );
};

export default StatsMetricCard;
