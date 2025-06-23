import { Badge } from "@/components/ui/badge";
import { Call } from "@/types/api/call-reporting";
import { Cell } from "@/types/cell";

const CallStatusCell = ({ row }: Cell<Call>) => {
  const status = row.getValue("call_status") as string;

  if (status === "Answered") {
    return (
      <Badge variant="success" className="capitalize">
        {status}
      </Badge>
    );
  }
  if (status === "Busy") {
    return (
      <Badge variant="warning" className="capitalize">
        {status}
      </Badge>
    );
  }
  if (status === "Failed") {
    return (
      <Badge variant="destructive" className="capitalize">
        {status}
      </Badge>
    );
  }
  if (status === "Not Answered") {
    return (
      <Badge variant="muted" className="capitalize">
        {status}
      </Badge>
    );
  }
  return (
    <Badge variant="default" className="capitalize">
      {status}
    </Badge>
  );
};

export default CallStatusCell;
