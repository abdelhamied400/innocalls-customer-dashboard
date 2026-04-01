import { Badge, BadgeVariant } from "@/components/ui/badge";
import { CallBridgeCall } from "@/types/callBridge";
import { Cell } from "@/types/cell";

type EndCallStatusCellProps = Cell<CallBridgeCall>;

const variantMap: Record<string, BadgeVariant> = {
  Completed: "success",
  Deleted: "neutral",
  "Call Failed": "destructive",
};

const EndCallStatusCell = ({ cell }: EndCallStatusCellProps) => {
  const value = String(cell.getValue() || "-");

  return <Badge variant={variantMap[value] || "neutral"}>{value}</Badge>;
};

export default EndCallStatusCell;
