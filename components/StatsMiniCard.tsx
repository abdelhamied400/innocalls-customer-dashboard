import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const miniCardVariants = cva(
  "flex flex-col gap-2 rounded-2xl p-3 transition-all",
  {
    variants: {
      color: {
        default: "bg-gray-100",
        primary: "bg-primary-100",
        warning: "bg-warning-100",
        destructive: "bg-destructive-100",
        success: "bg-success-100",
        info: "bg-indigo-100",
      },
    },
    defaultVariants: {
      color: "default",
    },
  },
);

const miniCardIconVariants = cva(
  "w-8 h-8 flex items-center justify-center rounded-full transition-colors",
  {
    variants: {
      color: {
        default: "text-gray-500",
        primary: "text-primary-600",
        warning: "text-amber-600",
        destructive: "text-destructive-600",
        success: "text-success-600",
        info: "text-indigo-600",
      },
    },
    defaultVariants: {
      color: "default",
    },
  },
);

type StatsMiniCardProps = VariantProps<typeof miniCardVariants> & {
  icon: React.ReactNode;
  label?: string;
  value?: string | number;
  className?: string;
};

const StatsMiniCard = ({
  icon,
  label,
  value,
  color = "default",
  className,
}: StatsMiniCardProps) => {
  return (
    <div className={cn(miniCardVariants({ color }), className)}>
      <div className="flex items-center gap-2">
        <div className={cn(miniCardIconVariants({ color }))}>{icon}</div>
        {label && <span className="font-semibold text-gray-500">{label}</span>}
      </div>
      <p className="font-bold text-2xl text-gray-700 transition-colors">
        {value}
      </p>
    </div>
  );
};

export default StatsMiniCard;
