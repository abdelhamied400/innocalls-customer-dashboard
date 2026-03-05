"use client";

import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTranslations } from "@/providers/TranslationProvider";
import { ScheduledReport } from "@/types/api/report";
import { CellContext } from "@tanstack/react-table";
import { X } from "lucide-react";
import { useState } from "react";

const RecipientsCell = ({ row }: CellContext<ScheduledReport, unknown>) => {
  const recipients = row.original.recipients;
  const reportName = row.original.name;
  const t = useTranslations("reports.scheduled.cells.recipients");
  const [open, setOpen] = useState(false);

  if (recipients.length === 0) {
    return <span className="text-muted-foreground">-</span>;
  }

  if (recipients.length === 1) {
    return <span>{recipients[0]}</span>;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="underline text-black cursor-pointer">
          {t("count", { count: recipients.length })}
        </button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle>{t("sheetTitle", { name: reportName })}</SheetTitle>
          <SheetClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </SheetClose>
        </SheetHeader>
        <div className="flex flex-col gap-2 mt-4 max-h-[calc(100vh-120px)] overflow-y-auto">
          {recipients.map((recipient, index) => (
            <div
              key={index}
              className="bg-[#efefef] px-4 py-2 rounded-lg font-bold"
            >
              {recipient}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default RecipientsCell;
