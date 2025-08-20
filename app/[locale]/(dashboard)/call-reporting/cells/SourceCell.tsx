import { Call } from "@/types/api/call-reporting";
import { Cell } from "@/types/cell";
import { useState } from "react";
import PhoneHistoryModal from "../PhoneHistoryModal";
import { cn } from "@/lib/utils";
import { OpenInBrowser } from "@mui/icons-material";

const SourceCell = ({ row }: Cell<Call>) => {
  const [open, setOpen] = useState(false);
  const number = row.original.from.number;
  const direction = row.original.direction?.toLowerCase();
  const isClickable = direction === "incoming";
  return (
    <div className="source-cell">
      <div
        className={cn("flex flex-col", {
          "cursor-pointer hover:underline": isClickable,
        })}
        onClick={() => isClickable && setOpen(true)}
      >
        <p>{row.original.from.name}</p>
        <p className="text-gray-500 flex items-center gap-1">
          <span>{"\u200E" + number}</span> {isClickable && <OpenInBrowser />}
        </p>
      </div>

      <PhoneHistoryModal
        open={open}
        onOpenChange={setOpen}
        phoneNumber={number}
      />
    </div>
  );
};

export default SourceCell;
