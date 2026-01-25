import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/providers/TranslationProvider";
import { FullTag } from "@/types/api/tag";
import { ColumnDef } from "@tanstack/react-table";
import TagActionsCell from "./TagActionsCell";

export const columns = (
  t: ReturnType<typeof useTranslations>
): ColumnDef<FullTag, any>[] => [
  {
    accessorKey: "nameAR",
    header: ({ column }: { column: any }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {t("settings.call.tags.columns.nameAR")}
      </Button>
    ),
  },
  {
    accessorKey: "nameEN",
    header: ({ column }: { column: any }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {t("settings.call.tags.columns.nameEN")}
      </Button>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }: { column: any }) => (
      <p className="text-black">{t("settings.call.tags.columns.status")}</p>
    ),
    cell: ({ row }) => (
      <Badge variant={row.original.isDeleted ? "warning" : "success"}>
        {row.original.isDeleted
          ? t("common.status.inactive")
          : t("common.status.active")}
      </Badge>
    ),
  },
  {
    accessorKey: "actions",
    header: ({ column }: { column: any }) => (
      <p className="text-black">{t("settings.call.tags.columns.actions")}</p>
    ),
    cell: ({ row }) => <TagActionsCell tag={row.original} />,
  },
];
