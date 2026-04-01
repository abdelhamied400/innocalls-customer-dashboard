import CreatedAtCell from "./cells/CreatedAtCell";
import ActionsCell from "./cells/ActionsCell";
import { CallBridge } from "@/types/callBridge";
import SortingHead from "@/components/SortingHead";

export type CallBridgeCols = CallBridge;

export const columns = (t: any) => [
  {
    accessorKey: "createdAt",
    header: ({ column }: any) => (
      <SortingHead column={column}>
        {t("list.columns.creationDate")}
      </SortingHead>
    ),

    cell: CreatedAtCell,
  },
  {
    accessorKey: "name",
    header: ({ column }: any) => (
      <SortingHead column={column}>{t("list.columns.name")}</SortingHead>
    ),
  },
  {
    header: t("list.columns.actions"),
    cell: ActionsCell,
  },
];
