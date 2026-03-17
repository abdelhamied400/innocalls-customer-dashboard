import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "@/providers/TranslationProvider";
import { FreshdeskCredential } from "@/types/api/freshdesk-credential";
import { ColumnDef } from "@tanstack/react-table";
import { ContentCopy } from "@mui/icons-material";
import { toast } from "sonner";
import FreshdeskActionsCell from "./FreshdeskActionsCell";

const CopyableApiKey = ({
  apiKey,
  t,
}: {
  apiKey: string;
  t: ReturnType<typeof useTranslations>;
}) => {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(apiKey);
    toast.success(t("developers.freshdesk.messages.copiedToClipboard"));
  };

  return (
    <div className="flex items-center gap-1">
      <span className="font-mono text-sm">
        {apiKey.slice(0, 12)}...
      </span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCopy}>
              <ContentCopy className="!text-base" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("developers.freshdesk.actions.copy")}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export const columns = (
  t: ReturnType<typeof useTranslations>,
): ColumnDef<FreshdeskCredential, any>[] => [
  {
    accessorKey: "apiKey",
    header: () => (
      <p className="text-black">
        {t("developers.freshdesk.columns.apiKey")}
      </p>
    ),
    enableSorting: false,
    cell: ({ row }) => <CopyableApiKey apiKey={row.original.apiKey} t={t} />,
  },
  {
    accessorKey: "status",
    header: () => (
      <p className="text-black">
        {t("developers.freshdesk.columns.status")}
      </p>
    ),
    cell: ({ row }) => (
      <Badge variant={row.original.isDeleted ? "warning" : "success"}>
        {row.original.isDeleted
          ? t("common.status.inactive")
          : t("common.status.active")}
      </Badge>
    ),
    filterFn: (row, _id, value) => {
      return row.original.isDeleted === value;
    },
  },
  {
    accessorKey: "actions",
    header: () => (
      <p className="text-black">
        {t("developers.freshdesk.columns.actions")}
      </p>
    ),
    cell: ({ row }) => <FreshdeskActionsCell credential={row.original} />,
  },
];
