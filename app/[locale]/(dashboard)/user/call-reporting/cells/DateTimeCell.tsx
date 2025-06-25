import { Call } from "@/types/api/call-reporting";
import { Cell } from "@/types/cell";

const DateTimeCell = ({ row }: Cell<Call>) => {
  return (
    <div className="datetime-cell font-normal">
      <p>{row.original.datetime.date}</p>
      <p className="text-gray-500">{row.original.datetime.time}</p>
    </div>
  );
};

export default DateTimeCell;
