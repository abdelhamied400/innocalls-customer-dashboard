import { Call } from "@/types/api/call-reporting";
import { Cell } from "@/types/cell";
import { useState } from "react";
import PhoneHistoryModal from "../PhoneHistoryModal";

const DestinationCell = ({ row }: Cell<Call>) => {
  const [open, setOpen] = useState(false);
  const number = row.original.to.number;
  const direction = row.original.direction?.toLowerCase();
  const isClickable = direction === "outgoing" || direction === "outbound";
  return (
    <>
      {isClickable ? (
        <div
          className="datetime-cell font-normal cursor-pointer hover:underline"
          onClick={() => setOpen(true)}
        >
          <p>{row.original.to.name}</p>
          <p className="text-gray-500">{"\u200E" + number}</p>
        </div>
      ) : (
        <div className="datetime-cell font-normal">
          <p>{row.original.to.name}</p>
          <p className="text-gray-500">{"\u200E" + number}</p>
        </div>
      )}
      <PhoneHistoryModal
        open={open}
        onOpenChange={setOpen}
        phoneNumber={number}
      />
    </>
  );
};

export default DestinationCell;
