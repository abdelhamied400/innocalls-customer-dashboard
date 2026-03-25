"use client";

import { Badge, BadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/providers/TranslationProvider";
import { ColumnDef } from "@tanstack/react-table";
import { Ticket } from "@/services/tickets.service";
import { format } from "date-fns";
import Link from "next/link";
import { Visibility } from "@mui/icons-material";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const getStatusVariant = (status: string): BadgeVariant => {
  switch (status) {
    case "Open":
      return "success";
    case "Closed":
      return "muted";
    default:
      return "secondary";
  }
};

const departmentVariants: BadgeVariant[] = [
  "default",
  "warning",
  "success",
  "destructive",
];

const getDepartmentVariant = (department: string): BadgeVariant => {
  if (!department) return "secondary";
  const hash = department
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return departmentVariants[hash % departmentVariants.length];
};

export const columns = (
  t: ReturnType<typeof useTranslations>
): ColumnDef<Ticket, any>[] => [
  {
    accessorKey: "ticketNumber",
    header: t("columns.ticketNumber"),
    cell: ({ row }: { row: any }) => (
      <span className="font-medium">#{row.getValue("ticketNumber")}</span>
    ),
  },
  {
    accessorKey: "subject",
    header: t("columns.subject"),
    cell: ({ row }: { row: any }) => {
      const subject = row.getValue("subject") as string;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p
                dir="auto"
                className="text-sm text-gray-700 truncate max-w-[200px] cursor-pointer"
              >
                {subject}
              </p>
            </TooltipTrigger>
            <TooltipContent className="max-w-md p-3">
              <p dir="auto" className="text-sm leading-relaxed whitespace-normal">
                {subject}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "departmentName",
    header: t("columns.department"),
    cell: ({ row }: { row: any }) => {
      const department = row.getValue("departmentName") as string;
      return (
        <Badge variant={getDepartmentVariant(department)}>
          {department}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: t("columns.status"),
    cell: ({ row }: { row: any }) => (
      <Badge variant={getStatusVariant(row.getValue("status"))}>
        {t(`status.${row.getValue("status")}`)}
      </Badge>
    ),
  },
  {
    accessorKey: "createdTime",
    header: t("columns.createdTime"),
    cell: ({ row }: { row: any }) => {
      const date = new Date(row.getValue("createdTime"));
      return (
        <div className="font-normal">
          <p>{format(date, "dd MMM yyyy")}</p>
          <p className="text-gray-500">{format(date, "hh:mm a")}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: t("columns.actions"),
    cell: ({ row }: { row: any }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={`/innosupport/${row.original.id}`}>
              <Button variant="ghost-primary" size="icon">
                <Visibility />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("actions.view")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
];
