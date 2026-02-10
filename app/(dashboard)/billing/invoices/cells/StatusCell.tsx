"use client";

import { Badge } from "@/components/ui/badge";
import { useTranslations } from "@/providers/TranslationProvider";
import { Cell } from "@/types/cell";
import { Invoice } from "../columns";

const StatusCell = ({ row }: Cell<Invoice>) => {
  const t = useTranslations("billing.invoices");
  const status = row.getValue("status") as string;
  const variants: any = {
    paid: "success",
    overdue: "destructive",
    draft: "muted",
  };

  return (
    <div className="flex items-center gap-2">
      <Badge variant={variants[status] || "default"}>
        {t(`status.${status}`)}
      </Badge>
    </div>
  );
};

export default StatusCell;
