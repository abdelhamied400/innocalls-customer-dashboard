import { cn } from "@/lib/utils";

type DotGridProps = {
  count?: number;
  className?: string;
  dotClassName?: string;
};
const DotGrid = ({ count = 9, className, dotClassName }: DotGridProps) => {
  return (
    <div className={cn("grid grid-cols-3 gap-2", className)}>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className={cn("w-3 h-3 rounded-full bg-white/30", dotClassName)}
        />
      ))}
    </div>
  );
};

export default DotGrid;
