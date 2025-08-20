import { Call } from "@/types/api/call-reporting";
import { Cell } from "@/types/cell";
import { useState } from "react";
import PhoneHistoryModal from "../phone-history/PhoneHistoryModal";
import { cn } from "@/lib/utils";
import { OpenInBrowser } from "@mui/icons-material";

const DestinationCell = ({ row }: Cell<Call>) => {
  const [open, setOpen] = useState(false);
  const number = row.original.to.number;
  const direction = row.original.direction?.toLowerCase();
  const isClickable = direction === "outgoing";
  return (
    <>
      <div
        className={cn("flex flex-col", {
          "cursor-pointer hover:underline": isClickable,
        })}
        onClick={() => isClickable && setOpen(true)}
      >
        <p>{row.original.to.name}</p>
        <p className="text-gray-500 flex items-center gap-1">
          <span>{"\u200E" + number}</span> {isClickable && <OpenInBrowser />}
        </p>
      </div>
      <PhoneHistoryModal
        open={open}
        onOpenChange={setOpen}
        phoneNumber={number}
      />
    </>
  );
};

export default DestinationCell;
