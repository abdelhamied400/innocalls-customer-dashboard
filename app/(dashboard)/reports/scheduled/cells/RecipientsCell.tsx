"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslations } from "@/providers/TranslationProvider";
import { ScheduledReport } from "@/types/api/report";
import { CellContext } from "@tanstack/react-table";
import { useState } from "react";

const RecipientsCell = ({ row }: CellContext<ScheduledReport, unknown>) => {
  const recipients = row.original.recipients;
  const t = useTranslations("reports.scheduled.cells.recipients");
  const [open, setOpen] = useState(false);

  if (recipients.length === 0) {
    return <span className="text-muted-foreground">-</span>;
  }

  if (recipients.length === 1) {
    return <span>{recipients[0]}</span>;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="underline text-black cursor-pointer">
          {t("count", { count: recipients.length })}
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("dialogTitle")}</DialogTitle>
          <DialogDescription>{t("dialogDescription")}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto">
          {recipients.map((recipient, index) => (
            <Badge key={index} variant="secondary">
              {recipient}
            </Badge>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecipientsCell;
