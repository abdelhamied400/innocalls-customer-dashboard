import CreatedAtCell from "./cells/CreatedAtCell";
import StatusCell from "./cells/StatusCell";
import ActionsCell from "./cells/ActionsCell";
import { CallSurvey } from "@/types/callSurvey";
import SortingHead from "@/components/SortingHead";

export type CallSurveyCols = CallSurvey;

export const columns = (t: any) => [
  {
    accessorKey: "createdAt",
    header: ({ column }: any) => (
      <SortingHead column={column}>
        {t("active.columns.creationDate")}
      </SortingHead>
    ),
    cell: CreatedAtCell,
  },
  {
    accessorKey: "name",
    header: ({ column }: any) => (
      <SortingHead column={column}>{t("active.columns.name")}</SortingHead>
    ),
  },
  {
    accessorKey: "status",
    header: t("active.columns.status"),
    cell: StatusCell,
  },
  {
    header: t("active.columns.actions"),
    cell: ActionsCell,
  },
];
