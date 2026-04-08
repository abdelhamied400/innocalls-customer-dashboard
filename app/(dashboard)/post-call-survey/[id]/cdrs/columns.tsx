import { PostCallSurveyCdr } from "@/types/api/post-call-survey";
import StatusCell from "./cells/StatusCell";
import CompletionStatusCell from "./cells/CompletionStatusCell";
import AgentCell from "./cells/AgentCell";
import ActionsCell from "./cells/ActionsCell";
import CreatedAtCell from "./cells/CreatedAtCell";

export type PostCallSurveyCdrCols = PostCallSurveyCdr;

export const columns = (t: any) => [
  {
    accessorKey: "phone",
    header: t("columns.phone"),
  },
  {
    accessorKey: "agent",
    header: t("columns.agent"),
    cell: AgentCell,
  },
  {
    accessorKey: "status",
    header: t("columns.status"),
    cell: StatusCell,
  },
  {
    accessorKey: "createdAt",
    header: t("columns.callDate"),
    cell: CreatedAtCell,
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
