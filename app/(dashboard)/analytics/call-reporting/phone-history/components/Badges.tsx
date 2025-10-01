import { Badge } from "@/components/ui/badge";
import {
  BadgeVariant,
  DirectionBadgeProps,
  CallAnsweredBadgeProps,
} from "../types";
import { useTranslations } from "@/providers/TranslationProvider";

const directionVariants: Record<string, BadgeVariant> = {
  incoming: "muted",
  outgoing: "success",
};

export const DirectionBadge = ({ direction }: DirectionBadgeProps) => {
  const normalizedDirection = direction.toLowerCase();
  const t = useTranslations("callReporting.phoneHistory.badges.direction");

  const variant: BadgeVariant =
    directionVariants[normalizedDirection] ?? "default";

  return (
    <Badge variant={variant} className="capitalize">
      {t(`${direction}`)}
    </Badge>
  );
};

export const CallAnsweredBadge = ({ answered }: CallAnsweredBadgeProps) => {
  const t = useTranslations("callReporting.phoneHistory.badges.answered");

  return (
    <Badge
      className={`capitalize ${
        answered ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {answered ? t("yes") : t("no")}
    </Badge>
  );
};
