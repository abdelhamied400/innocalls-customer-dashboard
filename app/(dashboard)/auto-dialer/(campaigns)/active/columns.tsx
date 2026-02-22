import StatusCell from "./cells/StatusCell";
import ActionsCell from "./cells/ActionsCell";
import CreatedAtCell from "./cells/CreatedAtCell";
import DurationTypeCell from "./cells/DurationTypeCell";
import { AutoDialerCampaign } from "@/types/autoDialerCampaign";
import SortingHead from "@/components/SortingHead";

export type AutoDialerCampaignCols = AutoDialerCampaign;

export const columns = (t: any) => [
  {
    accessorKey: "createdAt",
    header: ({ column }: any) => (
      <SortingHead column={column}>
        {t("activeCampaigns.columns.creationDate")}
      </SortingHead>
    ),
    cell: CreatedAtCell,
  },
  {
    accessorKey: "name",
    header: ({ column }: any) => (
      <SortingHead column={column}>
        {t("activeCampaigns.columns.name")}
      </SortingHead>
    ),
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
