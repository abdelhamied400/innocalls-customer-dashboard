import { Badge, BadgeVariant } from "@/components/ui/badge";
import { useTranslations } from "@/providers/TranslationProvider";
import { CallBridgeCall } from "@/types/callBridge";
import { Cell } from "@/types/cell";

type EndCallStatusCellProps = Cell<CallBridgeCall>;

const variantMap: Record<string, BadgeVariant> = {
  Completed: "success",
  Deleted: "neutral",
  "Call Failed": "destructive",
};

const EndCallStatusCell = ({ cell }: EndCallStatusCellProps) => {
  const t = useTranslations("callBridge.calls.endCallStatuses");
  const value = String(cell.getValue() || "-");
  const translationKey = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
  const label = value === "-" ? value : t(translationKey as any);

  return <Badge variant={variantMap[value] || "neutral"}>{label}</Badge>;
};

export default EndCallStatusCell;
