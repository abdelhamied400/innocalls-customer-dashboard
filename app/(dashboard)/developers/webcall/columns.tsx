import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "@/providers/TranslationProvider";
import { WebCallApp } from "@/types/api/webcall";
import { ColumnDef } from "@tanstack/react-table";
import { ContentCopy } from "@mui/icons-material";
import { toast } from "sonner";
import WebCallActionsCell from "./WebCallActionsCell";

const BUNDLE_BASE_URL = "https://platform.innocalls.com/api/normal-web-call/bundle";

const CopyableSnippet = ({
  id,
  t,
}: {
  id: string;
  t: ReturnType<typeof useTranslations>;
}) => {
  const snippet = `<script type="module" src="${BUNDLE_BASE_URL}/${id}"></script>`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(snippet);
    toast.success(t("developers.webcall.messages.copiedSnippet"));
  };

  return (
    <div className="flex items-center gap-1">
      <span className="font-mono text-xs truncate max-w-[120px]" dir="ltr">
        {id}
      </span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCopy}>
              <ContentCopy className="!text-base" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("developers.webcall.actions.copySnippet")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export const columns = (
  t: ReturnType<typeof useTranslations>,
): ColumnDef<WebCallApp, any>[] => [
  {
    accessorKey: "id",
    header: () => (
      <p className="text-black">
        {t("developers.webcall.columns.id")}
      </p>
    ),
    enableSorting: false,
    filterFn: (row, _columnId, filterValue) => {
      const search = String(filterValue).toLowerCase();
      const id = row.original.id.toLowerCase();
      const iconText = (row.original.iconText ?? "").toLowerCase();
      const callerId = (row.original.callerId ?? "").toLowerCase();
      const dest = (row.original.destinationNumber ?? "").toLowerCase();
      const domains = (row.original.domains ?? []).map((d) => d.toLowerCase());
      return (
        id.includes(search) ||
        iconText.includes(search) ||
        callerId.includes(search) ||
        dest.includes(search) ||
        domains.some((d) => d.includes(search))
      );
    },
    cell: ({ row }) => <CopyableSnippet id={row.original.id} t={t} />,
  },
  {
    accessorKey: "iconText",
    header: () => (
      <p className="text-black">
        {t("developers.webcall.columns.iconText")}
      </p>
    ),
    enableSorting: false,
    cell: ({ row }) => (
      <span className="font-medium">{row.original.iconText ?? "-"}</span>
    ),
  },
  {
    accessorKey: "callerId",
    header: () => (
      <p className="text-black">
        {t("developers.webcall.columns.callerId")}
      </p>
    ),
    enableSorting: false,
    cell: ({ row }) => (
      <span className="font-mono text-sm" dir="ltr">{row.original.callerId ?? "-"}</span>
    ),
  },
  {
    accessorKey: "destinationNumber",
    header: () => (
      <p className="text-black">
        {t("developers.webcall.columns.destinationNumber")}
      </p>
    ),
    enableSorting: false,
    cell: ({ row }) => (
      <span className="font-mono text-sm" dir="ltr">{row.original.destinationNumber ?? "-"}</span>
    ),
  },
  {
    accessorKey: "domains",
    header: () => (
      <p className="text-black">
        {t("developers.webcall.columns.domains")}
      </p>
    ),
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {(row.original.domains ?? []).map((domain, index) => (
          <Badge key={index} variant="outline" className="text-xs" dir="ltr">
            {domain}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "serviceEnabled",
    header: () => (
      <p className="text-black">
        {t("developers.webcall.columns.status")}
      </p>
    ),
    cell: ({ row }) => (
      <Badge variant={row.original.serviceEnabled ? "success" : "warning"}>
        {row.original.serviceEnabled
          ? t("common.status.active")
          : t("common.status.inactive")}
      </Badge>
    ),
    filterFn: (row, _id, value) => {
      return row.original.serviceEnabled === value;
    },
  },
  {
    accessorKey: "actions",
    header: () => (
      <p className="text-black">
        {t("developers.webcall.columns.actions")}
      </p>
    ),
    cell: ({ row }) => <WebCallActionsCell app={row.original} />,
  },
];
