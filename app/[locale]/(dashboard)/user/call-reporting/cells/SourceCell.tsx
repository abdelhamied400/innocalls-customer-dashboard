import { Call } from "@/types/api/call-reporting";
import { Cell } from "@/types/cell";

const SourceCell = ({ row }: Cell<Call>) => {
  return (
    <div className="datetime-cell font-normal">
      <p>{row.original.from.name}</p>
      <p className="text-gray-500">{row.original.from.number}</p>
    </div>
  );
};

export default SourceCell;
