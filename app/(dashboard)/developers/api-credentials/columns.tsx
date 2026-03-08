import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "@/providers/TranslationProvider";
import { ApiCredential } from "@/types/api/api-credential";
import { ColumnDef } from "@tanstack/react-table";
import { ContentCopy } from "@mui/icons-material";
import { toast } from "sonner";
import ApiCredentialActionsCell from "./ApiCredentialActionsCell";

const CopyableApiId = ({
  apiId,
  t,
}: {
  apiId: string;
  t: ReturnType<typeof useTranslations>;
}) => {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(apiId);
    toast.success(t("developers.apiCredentials.messages.copiedToClipboard"));
  };

  return (
    <div className="flex items-center gap-1">
      <span className="font-mono text-sm" dir="ltr">
        {apiId.slice(0, 12)}...
      </span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleCopy}
            >
              <ContentCopy className="!text-base" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {t("developers.apiCredentials.actions.copy")}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export const columns = (
  t: ReturnType<typeof useTranslations>,
): ColumnDef<ApiCredential, any>[] => [
  {
    accessorKey: "title",
    header: () => (
      <p className="text-black">
        {t("developers.apiCredentials.columns.title")}
      </p>
    ),
    filterFn: (row, _columnId, filterValue) => {
      const search = String(filterValue).toLowerCase();
      const title = row.original.title.toLowerCase();
      const apiId = row.original.apiId.toLowerCase();
      return title.includes(search) || apiId.includes(search);
    },
    cell: ({ row }) => (
      <span className="font-medium">{row.original.title}</span>
    ),
  },
  {
    accessorKey: "apiId",
    header: () => (
      <p className="text-black">
        {t("developers.apiCredentials.columns.apiId")}
      </p>
    ),
    enableSorting: false,
    cell: ({ row }) => (
      <CopyableApiId apiId={row.original.apiId} t={t} />
    ),
  },
  {
    accessorKey: "services",
    header: () => (
      <p className="text-black">
        {t("developers.apiCredentials.columns.services")}
      </p>
    ),
    enableSorting: false,
    filterFn: (row, _columnId, filterValue: string[]) => {
      if (!filterValue || filterValue.length === 0) return true;
      return filterValue.some((s) => row.original.services.includes(s));
    },
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.services.map((service, index) => (
          <Badge key={index} variant="outline" className="text-xs">
            {t(`developers.apiCredentials.serviceLabels.${service}`)}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => (
      <p className="text-black">
        {t("developers.apiCredentials.columns.status")}
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
        {t("developers.apiCredentials.columns.actions")}
      </p>
    ),
    cell: ({ row }) => (
      <ApiCredentialActionsCell credential={row.original} />
    ),
  },
];
