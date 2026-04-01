import { Badge, BadgeVariant } from "@/components/ui/badge";
import { useTranslations } from "@/providers/TranslationProvider";
import { CallBridgeCall } from "@/types/callBridge";
import { Cell } from "@/types/cell";

type StatusCellProps = Cell<CallBridgeCall>;

const variantMap: Record<string, BadgeVariant> = {
  pending: "warning",
  processing: "info",
  "in-progress": "info",
  in_progress: "info",
  complete: "success",
  deleted: "neutral",
};

const StatusCell = ({ cell }: StatusCellProps) => {
  const t = useTranslations("callBridge.calls.statuses");
  const value = String(cell.getValue() || "");
  const label = t(value.replace(/-/g, "_") as any);

  return <Badge variant={variantMap[value] || "neutral"}>{label}</Badge>;
};

export default StatusCell;
