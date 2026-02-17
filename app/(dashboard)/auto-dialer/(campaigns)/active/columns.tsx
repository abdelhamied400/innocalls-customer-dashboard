import StatusCell from "./cells/StatusCell";
import ActionsCell from "./cells/ActionsCell";
import CreatedAtCell from "./cells/CreatedAtCell";
import DurationTypeCell from "./cells/DurationTypeCell";
import { AutoDialerCampaign } from "@/types/autoDialerCampaign";

export type AutoDialerCampaignCols = AutoDialerCampaign;

export const columns = (t: any) => [
  {
    accessorKey: "createdAt",
    header: t("activeCampaigns.columns.creationDate"),
    cell: CreatedAtCell,
  },
  {
    accessorKey: "name",
    header: t("activeCampaigns.columns.name"),
  },
  {
    accessorKey: "durationType",
    header: t("activeCampaigns.columns.durationType"),
    cell: DurationTypeCell,
  },
  {
    accessorKey: "status",
    header: t("activeCampaigns.columns.status"),
    cell: StatusCell,
  },
  {
    header: t("activeCampaigns.columns.actions"),
    cell: ActionsCell,
  },
];
