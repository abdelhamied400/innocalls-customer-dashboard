"use client";
import { CallSurvey } from "@/types/callSurvey";
import { Cell } from "@/types/cell";
import { useTranslations } from "@/providers/TranslationProvider";
import { Stop, Check, Close, QuestionMark } from "@mui/icons-material";
import { ReactNode } from "react";

const statusConfig: Record<
  string,
  { color: string; bg: string; icon: ReactNode }
> = {
  finished: {
    color: "#ef3636",
    bg: "#ef36361a",
    icon: <Stop sx={{ fontSize: 14 }} />,
  },
  completed: {
    color: "#007bff",
    bg: "#007bff1a",
    icon: <Check sx={{ fontSize: 14 }} />,
  },
  cancelled: {
    color: "#ef6a36",
    bg: "#ef6a361a",
    icon: <Close sx={{ fontSize: 14 }} />,
  },
};

const defaultConfig = {
  color: "#6b7280",
  bg: "#6b72801a",
  icon: <QuestionMark sx={{ fontSize: 14 }} />,
};

type StatusCellProps = Cell<CallSurvey>;
const StatusCell = ({ row }: StatusCellProps) => {
  const t = useTranslations("callSurvey.active");
  const status = row.original.status;
  const config = statusConfig[status] || defaultConfig;
  const label = t(`statuses.${status}` as any) || status;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold capitalize"
      style={{ color: config.color, backgroundColor: config.bg }}
    >
      <span className="flex items-center">{config.icon}</span>
      {label}
    </span>
  );
};

export default StatusCell;
