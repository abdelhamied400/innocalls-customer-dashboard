import { ColumnDef } from "@tanstack/react-table";

type AutoDialerCampaign = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

export const columns: ColumnDef<AutoDialerCampaign>[] = [
  {
    accessorKey: "userId",
    header: "user Id",
  },
  {
    accessorKey: "id",
    header: "id",
  },
  {
    accessorKey: "title",
    header: "title",
  },
  {
    accessorKey: "completed",
    header: "completed",
  },
];
