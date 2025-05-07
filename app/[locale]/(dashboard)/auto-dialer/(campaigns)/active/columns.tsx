import { ColumnDef } from "@tanstack/react-table";
import StatusCell from "./cells/StatusCell";
import ActionsCell from "./cells/ActionsCell";
import CreatedAtCell from "./cells/CreatedAtCell";

export type AutoDialerCampaignCols = {
  createdAt: string;
  name: string;
  durationType: string;
  status: string;
};

export const columns: ColumnDef<AutoDialerCampaignCols, any>[] = [
  {
    accessorKey: "createdAt",
    header: "Creation Date",
    cell: CreatedAtCell,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "durationType",
    header: "Duration Type",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: StatusCell,
  },
  {
    header: "Actions",
    cell: ActionsCell,
  },
];
