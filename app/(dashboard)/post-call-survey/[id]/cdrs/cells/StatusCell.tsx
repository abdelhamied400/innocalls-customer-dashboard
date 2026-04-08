"use client";

import { PostCallSurveyCdr } from "@/types/api/post-call-survey";
import { Cell } from "@/types/cell";
import { useTranslations } from "@/providers/TranslationProvider";

const statusColors: Record<string, string> = {
  "User did not answer": "#FF6B6B",
  "Airplane Mode Enabled": "#FFB74D",
  Initiated: "#FFC107",
  Processing: "#66BB6A",
  "Call Failed": "#D32F2F",
  "User Busy/Rejected By User": "#FF8A65",
  "User Connected": "#43A047",
  "User Unreachable (Out of Network Coverage or Airplane Mode)": "#FF9800",
  Completed: "#5C6BC0",
  Timeout: "#E53935",
  Abandoned: "#F4511E",
};

type StatusCellProps = Cell<PostCallSurveyCdr>;
const StatusCell = ({ row }: StatusCellProps) => {
  const t = useTranslations("postCallSurvey.cdrs");
  const status = row.original.status;
  const color = statusColors[status] || "#ccc";

  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white"
      style={{ backgroundColor: color }}
    >
      {t(`statuses.${status}` as any) || status}
    </span>
  );
};

export default StatusCell;
