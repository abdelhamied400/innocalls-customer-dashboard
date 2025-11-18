import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/providers/TranslationProvider";
import { FullTag } from "@/types/api/tag";
import { Edit, Pause, PlayArrow } from "@mui/icons-material";
import { ColumnDef } from "@tanstack/react-table";

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
        Name in Arabic
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
        Name in English
      </Button>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }: { column: any }) => (
      <p className="text-black">Status</p>
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
    accessorKey: "status",
    header: ({ column }: { column: any }) => (
      <p className="text-black">Actions</p>
    ),
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button variant="ghost" size="icon" className="text-gray-400">
          <Edit />
        </Button>
        <Button
          variant={row.original.isDeleted ? "ghost-success" : "ghost-warning"}
          size="icon"
        >
          {row.original.isDeleted ? <PlayArrow /> : <Pause />}
        </Button>
      </div>
    ),
  },
];
