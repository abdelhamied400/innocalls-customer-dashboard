import { Call } from "@/types/api/call-reporting";
import { Cell } from "@/types/cell";
import { useState } from "react";
import PhoneHistoryModal from "../phone-history/PhoneHistoryModal";
import { cn } from "@/lib/utils";
import { History } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { useTranslations } from "@/providers/TranslationProvider";

const SourceCell = ({ row }: Cell<Call>) => {
  const [open, setOpen] = useState(false);
  const number = row.original.from.number;
  const direction = row.original.direction?.toLowerCase();
  const isClickable = direction === "incoming";

  const t = useTranslations("callReporting.actions");

  const content = (
    <div
      className={cn("flex flex-col", {
        "cursor-pointer hover:underline": isClickable,
      })}
      onClick={() => isClickable && setOpen(true)}
    >
      <p>{row.original.from.name}</p>
      <p className="text-gray-500 flex items-center gap-1">
        <span>{"\u200E" + number}</span>
        {isClickable && <History className="text-sm" />}
      </p>
    </div>
  );

  return (
    <div className="source-cell">
      {isClickable ? (
        <Tooltip title={t("viewHistory")} arrow>
          {content}
        </Tooltip>
      ) : (
        content
      )}

      <PhoneHistoryModal
        open={open}
        onOpenChange={setOpen}
        phoneNumber={number}
      />
    </div>
  );
};

export default SourceCell;
