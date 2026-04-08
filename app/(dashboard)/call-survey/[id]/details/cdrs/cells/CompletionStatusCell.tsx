"use client";
import { CallSurveyCdr } from "@/types/callSurvey";
import { Cell } from "@/types/cell";
import { useTranslations } from "@/providers/TranslationProvider";

const completionColors: Record<string, string> = {
  complete: "#66BB6A",
  partial: "#0F6B6B",
  "no-response": "#FF6B6B",
};

type CompletionStatusCellProps = Cell<CallSurveyCdr>;
const CompletionStatusCell = ({ row }: CompletionStatusCellProps) => {
  const t = useTranslations("callSurvey.cdrs");
  const status = row.original.completionStatus;
  const color = completionColors[status] || "#ccc";

  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white"
      style={{ backgroundColor: color }}
    >
      {t(`completionStatuses.${status}` as any) || status}
    </span>
  );
};

export default CompletionStatusCell;
