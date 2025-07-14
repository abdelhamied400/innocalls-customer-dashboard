import { cva, VariantProps } from "class-variance-authority";

type StatsSubCardProps = VariantProps<typeof cardStyles> & {
  value: string;
  label: string;
};

const cardStyles = cva(
  "text-center p-3 rounded-lg border border-transparent transition-colors",
  {
    variants: {
      color: {
        default:
          "bg-gray-50 group-hover:border-gray-200 group-hover:bg-gray-500/5",
        primary:
          "bg-primary-50 group-hover:border-primary-200 group-hover:bg-primary-100",
        success:
          "bg-green-50 group-hover:border-green-200 group-hover:bg-green-100",
        destructive:
          "bg-red-50 group-hover:border-red-200 group-hover:bg-red-100",
        info: "bg-indigo-50 group-hover:border-indigo-200 group-hover:bg-indigo-100",
        warning:
          "bg-amber-50 group-hover:border-amber-200 group-hover:bg-amber-100",
      },
    },
    defaultVariants: {
      color: "default",
    },
  }
);

const valueStyles = cva("text-lg font-bold transition-colors", {
  variants: {
    color: {
      default: "text-gray-800 group-hover:text-gray-800",
      primary: "text-primary-800 group-hover:text-primary-800",
      success: "text-green-800 group-hover:text-green-800",
      destructive: "text-red-800 group-hover:text-red-800",
      info: "text-indigo-800 group-hover:text-indigo-800",
      warning: "text-amber-800 group-hover:text-amber-800",
    },
  },
  defaultVariants: {
    color: "default",
  },
});

const StatsSubCard = ({
  value,
  label,
  color = "default",
}: StatsSubCardProps) => {
  return (
    <div className={cardStyles({ color })}>
      <div className={valueStyles({ color })}>{value}</div>
      <div className="text-xs text-gray-600">{label}</div>
    </div>
  );
};

export default StatsSubCard;
