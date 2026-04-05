import { CallSurveyCdr } from "@/types/callSurvey";
import StatusCell from "./cells/StatusCell";
import CompletionStatusCell from "./cells/CompletionStatusCell";
import ActionsCell from "./cells/ActionsCell";

export type SurveyCdrsCols = CallSurveyCdr;

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
    accessorKey: "status",
    header: t("columns.status"),
    cell: StatusCell,
  },
  {
    accessorKey: "initiatedAt",
    header: t("columns.initiatedAt"),
  },
  {
    accessorKey: "completionStatus",
    header: t("columns.completionStatus"),
    cell: CompletionStatusCell,
  },
  {
    accessorKey: "answeredQuestionsCount",
    header: t("columns.answeredQuestions"),
  },
  {
    accessorKey: "duration",
    header: t("columns.duration"),
  },
  {
    header: t("columns.actions"),
    cell: ActionsCell,
  },
];
