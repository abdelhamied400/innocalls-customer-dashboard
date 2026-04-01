import { Badge, BadgeVariant } from "@/components/ui/badge";
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
  const value = String(cell.getValue() || "");
  return <Badge variant={variantMap[value] || "neutral"}>{value}</Badge>;
};

export default StatusCell;
