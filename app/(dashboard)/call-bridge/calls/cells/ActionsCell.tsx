import { Button } from "@/components/ui/button";
import { CallBridgeCall } from "@/types/callBridge";
import { Cell } from "@/types/cell";
import { Visibility, VisibilityOff } from "@mui/icons-material";

type ActionsCellProps = Cell<CallBridgeCall>;

const ActionsCell = ({ row }: ActionsCellProps) => {
  const isExpanded = row.getIsExpanded();

  return (
    <Button
      variant="ghost-primary"
      size="icon"
      onClick={() => row.toggleExpanded()}
      aria-label="Toggle call details"
    >
      {isExpanded ? (
        <VisibilityOff fontSize="small" />
      ) : (
        <Visibility fontSize="small" />
      )}
    </Button>
  );
};

export default ActionsCell;
