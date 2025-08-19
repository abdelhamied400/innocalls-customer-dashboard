import { AgentCall } from "@/types/api/call-reporting";
import { Cell } from "@/types/cell";

const DateTimeCell = ({ row }: Cell<AgentCall>) => {
  return (
    <div className="datetime-cell font-normal">
      <p>{row.original.dateTime.date}</p>
      <p className="text-gray-500">{row.original.dateTime.time}</p>
    </div>
  );
};

export default DateTimeCell;
