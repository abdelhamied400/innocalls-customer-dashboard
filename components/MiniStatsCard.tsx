import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";

const miniStatsCardVariants = cva(
  "flex items-center gap-4 rounded-xl px-4 py-2 transition-colors duration-200 hover:shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-info-200",
        success: "bg-success-100",
        warning: "bg-warning-100",
        info: "bg-info-100",
        unstyled: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type MiniStatsCardProps = {
  icon: string;
  label: string;
  value: string | number;
} & VariantProps<typeof miniStatsCardVariants>;
const MiniStatsCard = ({ icon, label, value, variant }: MiniStatsCardProps) => {
  return (
    <div className={cn("mini-stat-card", miniStatsCardVariants({ variant }))}>
      <Image
        src={icon}
        alt="Waiting Time Icon"
        className="size-8"
        width={32}
        height={32}
      />
      <div className="details flex flex-col gap-1">
        <span className="">{label}</span>
        <span className="font-semibold">{value}</span>
      </div>
    </div>
  );
};

export default MiniStatsCard;
