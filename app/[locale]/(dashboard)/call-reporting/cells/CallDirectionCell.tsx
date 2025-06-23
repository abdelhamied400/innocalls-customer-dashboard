import { Badge, badgeVariants } from "@/components/ui/badge";
import { Call } from "@/types/api/call-reporting";
import { Cell } from "@/types/cell";
import { VariantProps } from "class-variance-authority";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("callReporting.direction");

  return (
    <Badge variant={variants[direction] || "default"} className="capitalize">
      {t(direction)}
    </Badge>
  );
};

export default CallDirectionCell;
