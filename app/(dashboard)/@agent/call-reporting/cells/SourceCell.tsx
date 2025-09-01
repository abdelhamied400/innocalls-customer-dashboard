import { AgentCall } from "@/types/api/call-reporting";
import { Cell } from "@/types/cell";

const SourceCell = ({ row }: Cell<AgentCall>) => {
  return (
    <div className="datetime-cell font-normal">
      <p>{row.original.from.name}</p>
      <p className="text-gray-500">{"\u200E" + row.original.from.number}</p>
    </div>
  );
};

export default SourceCell;
