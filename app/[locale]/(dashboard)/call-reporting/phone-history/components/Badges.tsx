import { Badge } from "@/components/ui/badge";
import {
  BadgeVariant,
  DirectionBadgeProps,
  CallAnsweredBadgeProps,
} from "../types";

const directionVariants: Record<string, BadgeVariant> = {
  incoming: "muted",
  outgoing: "success",
};

export const DirectionBadge = ({ direction }: DirectionBadgeProps) => {
  const normalizedDirection = direction.toLowerCase();
  const variant: BadgeVariant =
    directionVariants[normalizedDirection] ?? "default";

  return (
    <Badge variant={variant} className="capitalize">
      {direction}
    </Badge>
  );
};

export const CallAnsweredBadge = ({ answered }: CallAnsweredBadgeProps) => {
  return (
    <Badge
      className={`capitalize ${
        answered ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {answered ? "Yes" : "No"}
    </Badge>
  );
};
