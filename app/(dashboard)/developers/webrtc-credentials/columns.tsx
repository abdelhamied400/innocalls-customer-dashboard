import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "@/providers/TranslationProvider";
import { WebRTCCredential } from "@/types/api/webrtc-credential";
import { ColumnDef } from "@tanstack/react-table";
import { ContentCopy } from "@mui/icons-material";
import { toast } from "sonner";
import WebrtcActionsCell from "./WebrtcActionsCell";

const CopyableApiKey = ({
  apiKey,
  t,
}: {
  apiKey: string;
  t: ReturnType<typeof useTranslations>;
}) => {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(apiKey);
    toast.success(t("developers.webrtc.messages.copiedToClipboard"));
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
          <TooltipContent>{t("developers.webrtc.actions.copy")}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export const columns = (
  t: ReturnType<typeof useTranslations>,
): ColumnDef<WebRTCCredential, any>[] => [
  {
    accessorKey: "apiKey",
    header: () => (
      <p className="text-black">
        {t("developers.webrtc.columns.apiKey")}
      </p>
    ),
    enableSorting: false,
    filterFn: (row, _columnId, filterValue) => {
      const search = String(filterValue).toLowerCase();
      const apiKey = row.original.apiKey.toLowerCase();
      const domains = row.original.domains.map((d) => d.toLowerCase());
      return (
        apiKey.includes(search) ||
        domains.some((d) => d.includes(search))
      );
    },
    cell: ({ row }) => <CopyableApiKey apiKey={row.original.apiKey} t={t} />,
  },
  {
    accessorKey: "domains",
    header: () => (
      <p className="text-black">
        {t("developers.webrtc.columns.domains")}
      </p>
    ),
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.domains.map((domain, index) => (
          <Badge key={index} variant="outline" className="text-xs" dir="ltr">
            {domain}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => (
      <p className="text-black">
        {t("developers.webrtc.columns.status")}
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
        {t("developers.webrtc.columns.actions")}
      </p>
    ),
    cell: ({ row }) => <WebrtcActionsCell credential={row.original} />,
  },
];
