import { cn } from "@/lib/utils";

type PropertyProps = {
  label: string;
  value: string | number | React.ReactNode;
  className?: string;
};
const Property = ({ label, value, className }: PropertyProps) => {
  return (
    <div className={cn("property", className)}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  );
};

export default Property;
