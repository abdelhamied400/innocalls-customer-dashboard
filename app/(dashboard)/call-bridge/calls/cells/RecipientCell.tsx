import { CallBridgeCall } from "@/types/callBridge";
import { Cell } from "@/types/cell";

type RecipientCellProps = Cell<CallBridgeCall> & {
  type: "first" | "second";
};

const RecipientCell = ({ row, type }: RecipientCellProps) => {
  const recipient =
    type === "first"
      ? row.original.firstRecipient
      : row.original.secondRecipient;

  return (
    <div className="flex flex-col leading-tight items-center">
      <span className="text-sm">{recipient?.name || "-"}</span>
      <span className="text-sm font-bold" dir="ltr">
        {recipient?.phone || "-"}
      </span>
    </div>
  );
};

export default RecipientCell;
