"use client";
import { CallSurvey } from "@/types/callSurvey";
import { Cell } from "@/types/cell";
import { useTranslations } from "@/providers/TranslationProvider";
import {
  Add,
  CalendarToday,
  Sync,
  Close,
  Delete,
  Person,
  Pause,
  Stop,
  Check,
  QuestionMark,
} from "@mui/icons-material";
import { ReactNode } from "react";

const statusConfig: Record<
  string,
  { color: string; bg: string; icon: ReactNode; rotating?: boolean }
> = {
  created: {
    color: "#26c39c",
    bg: "#26c39c1a",
    icon: <Add sx={{ fontSize: 14 }} />,
  },
  "schedule-customers": {
    color: "#9000ff",
    bg: "#9000ff1a",
    icon: <CalendarToday sx={{ fontSize: 14 }} />,
  },
  "verifying-customers": {
    color: "#25b932",
    bg: "#25b9321a",
    icon: <Sync sx={{ fontSize: 14 }} />,
    rotating: true,
  },
  "verification-failed": {
    color: "#ef3636",
    bg: "#ef36361a",
    icon: <Close sx={{ fontSize: 14 }} />,
  },
  cancelled: {
    color: "#ef6a36",
    bg: "#ef6a361a",
    icon: <Close sx={{ fontSize: 14 }} />,
  },
  "corrupted-ignored": {
    color: "#ec952a",
    bg: "#ec952a1a",
    icon: <Delete sx={{ fontSize: 14 }} />,
  },
  "customers-inserted": {
    color: "#4c00ff",
    bg: "#4c00ff1a",
    icon: <Person sx={{ fontSize: 14 }} />,
  },
  "in-progress": {
    color: "#25cdd3",
    bg: "#25cdd31a",
    icon: <Sync sx={{ fontSize: 14 }} />,
  },
  active: {
    color: "#25cdd3",
    bg: "#25cdd31a",
    icon: <Sync sx={{ fontSize: 14 }} />,
    rotating: true,
  },
  paused: {
    color: "#ec952a",
    bg: "#ec952a1a",
    icon: <Pause sx={{ fontSize: 14 }} />,
  },
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
      <span
        className={`flex items-center ${config.rotating ? "animate-spin" : ""}`}
      >
        {config.icon}
      </span>
      {label}
    </span>
  );
};

export default StatusCell;
