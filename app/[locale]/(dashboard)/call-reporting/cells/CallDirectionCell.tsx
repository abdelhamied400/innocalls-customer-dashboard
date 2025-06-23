import { Badge, badgeVariants } from "@/components/ui/badge";
import { Call } from "@/types/api/call-reporting";
import { Cell } from "@/types/cell";
import { VariantProps } from "class-variance-authority";

const variants: Record<
  Call["direction"],
  VariantProps<typeof badgeVariants>["variant"]
> = {
  incoming: "muted",
  outgoing: "success",
  local: "secondary",
};
const CallDirectionCell = ({ row }: Cell<Call>) => {
  const direction = row.original.direction;
  return (
    <Badge variant={variants[direction] || "default"} className="capitalize">
      {row.getValue("direction")}
    </Badge>
  );
};

export default CallDirectionCell;
