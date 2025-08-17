import { Call } from "@/types/api/call-reporting";
import { Cell } from "@/types/cell";

const DestinationCell = ({ row }: Cell<Call>) => {
  return (
    <div className="datetime-cell font-normal">
      <p>{row.original.to.name}</p>
      <p className="text-gray-500">{row.original.to.number}</p>
    </div>
  );
};

export default DestinationCell;
