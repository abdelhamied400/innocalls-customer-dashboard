import { Call } from "@/types/api/call-reporting";
import { Cell } from "@/types/cell";
import { useState } from "react";
import PhoneHistoryModal from "../PhoneHistoryModal";

const SourceCell = ({ row }: Cell<Call>) => {
  const [open, setOpen] = useState(false);
  const number = row.original.from.number;
  return (
    <>
      <div
        className="datetime-cell font-normal cursor-pointer hover:underline"
        onClick={() => setOpen(true)}
      >
        <p>{row.original.from.name}</p>
        <p className="text-gray-500">{number}</p>
      </div>
      <PhoneHistoryModal
        open={open}
        onOpenChange={setOpen}
        phoneNumber={number}
      />
    </>
  );
};

export default SourceCell;
