"use client";

import { Badge } from "@/components/ui/badge";
import { OneTimeReport } from "@/types/api/report";
import { CellContext } from "@tanstack/react-table";

const RecipientsCell = ({ row }: CellContext<OneTimeReport, unknown>) => {
  const recipients = row.original.recipients;

  return (
    <div className="flex flex-wrap gap-1">
      {recipients.map((recipient, index) => (
        <Badge key={index} variant="secondary">
          {recipient}
        </Badge>
      ))}
    </div>
  );
};

export default RecipientsCell;
