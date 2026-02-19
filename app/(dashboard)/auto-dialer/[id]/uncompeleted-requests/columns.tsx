import { UncompletedRequest } from "@/types/autoDialerCampaign";

export type UncompletedRequestCols = UncompletedRequest;

export const columns = (t: any) => [
  {
    accessorKey: "phone",
    header: t("columns.phone"),
  },
  {
    accessorKey: "name",
    header: t("columns.name"),
  },
  {
    accessorKey: "remainingTrials",
    header: t("columns.remainingTrials"),
  },
];
