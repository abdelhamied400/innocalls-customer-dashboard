import CreatedAtCell from "./cells/CreatedAtCell";
import ActionsCell from "./cells/ActionsCell";
import { CallBridge } from "@/types/callBridge";

export type CallBridgeCols = CallBridge;

export const columns = (t: any) => [
  {
    accessorKey: "createdAt",
    header: t("list.columns.creationDate"),
    cell: CreatedAtCell,
  },
  {
    accessorKey: "name",
    header: t("list.columns.name"),
  },
  {
    header: t("list.columns.actions"),
    cell: ActionsCell,
  },
];
