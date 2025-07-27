import { cva, VariantProps } from "class-variance-authority";

const statsRowCardVariants = cva(
  "p-3 border rounded-lg hover:bg-gray-200 hover:border-gray-500 transition-colors flex justify-between items-center gap-1",
  {
    variants: {
      color: {
        default:
          "bg-gray-100 border-gray-200 hover:bg-gray-200 hover:border-gray-500",
        primary:
          "bg-primary-100 border-primary-200 hover:bg-primary-200 hover:border-primary-500",
        success:
          "bg-success-100 border-success-200 hover:bg-success-200 hover:border-success-500",
        destructive:
          "bg-destructive-100 border-destructive-200 hover:bg-destructive-200 hover:border-destructive-500",
        info: "bg-indigo-100 border-indigo-200 hover:bg-indigo-200 hover:border-indigo-500",
        warning:
          "bg-orange-100 border-orange-200 hover:bg-orange-200 hover:border-orange-500",
      },
    },
    defaultVariants: {
      color: "default",
    },
  }
);

type StatsRowCardProps = {
  label: React.ReactNode;
  value: React.ReactNode;
} & VariantProps<typeof statsRowCardVariants>;

const StatsRowCard = ({ label, value, color }: StatsRowCardProps) => {
  return (
    <div className={statsRowCardVariants({ color })}>
      <p>{label}</p>
      <p>{value}</p>
    </div>
  );
};

export default StatsRowCard;
