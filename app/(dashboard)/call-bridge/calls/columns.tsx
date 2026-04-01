import { CallBridgeCall } from "@/types/callBridge";
import StatusCell from "./cells/StatusCell";
import DateTimeCell from "./cells/DateTimeCell";
import RecipientCell from "./cells/RecipientCell";
import EndCallStatusCell from "./cells/EndCallStatusCell";
import ActionsCell from "./cells/ActionsCell";

export type CallBridgeCallsCols = CallBridgeCall;

export const columns = (t: any) => [
  {
    accessorKey: "firstRecipient.name",
    header: t("table.columns.firstRecipient"),
    cell: (ctx: any) => <RecipientCell {...ctx} type="first" />,
  },
  {
    accessorKey: "secondRecipient.name",
    header: t("table.columns.secondRecipient"),
    cell: (ctx: any) => <RecipientCell {...ctx} type="second" />,
  },
  {
    accessorKey: "endCallStatus",
    header: t("table.columns.endCallStatus"),
    cell: EndCallStatusCell,
  },
  {
    accessorKey: "status",
    header: t("table.columns.status"),
    cell: StatusCell,
  },
  {
    accessorKey: "scheduleDateTime",
    header: t("table.columns.scheduleDateTime"),
    cell: DateTimeCell,
  },
  {
    accessorKey: "timezone",
    header: t("table.columns.timezone"),
  },
  {
    id: "actions",
    header: t("table.columns.actions"),
    cell: ActionsCell,
  },
];
