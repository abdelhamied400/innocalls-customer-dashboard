"use client";
import { AgentCall } from "@/types/api/call-reporting";
import { ColumnDef } from "@tanstack/react-table";
import CallSummaryCell from "./cells/CallSummaryCell";
import DestinationCell from "./cells/DestinationCell";
import SourceCell from "./cells/SourceCell";
import DateTimeCell from "./cells/DateTimeCell";
import CallStatusCell from "./cells/CallStatusCell";
import CallDirectionCell from "./cells/CallDirectionCell";
import CallRecordingCell from "./cells/CallRecordingCell";
import { useTranslations } from "@/providers/TranslationProvider";

export const columns = (
  t: ReturnType<typeof useTranslations>
): ColumnDef<AgentCall>[] => [
  {
    accessorKey: "source",
    header: t("columns.source"),
    cell: SourceCell,
  },
  {
    accessorKey: "destination",
    header: t("columns.destination"),
    cell: DestinationCell,
  },
  {
    accessorKey: "datetime",
    header: t("columns.callDate"),
    cell: DateTimeCell,
  },
  {
    accessorKey: "waitTime",
    header: t("columns.waitTime"),
  },
  {
    accessorKey: "duration",
    header: t("columns.callDuration"),
  },
  {
    accessorKey: "call_status",
    header: t("columns.callStatus"),
    cell: CallStatusCell,
  },
  {
    accessorKey: "direction",
    header: t("columns.callDirection"),
    cell: CallDirectionCell,
  },
  {
    accessorKey: "callSummary",
    header: t("columns.callSummary"),
    cell: CallSummaryCell,
  },
  {
    accessorKey: "recording",
    header: t("columns.recording"),
    cell: CallRecordingCell,
  },
];
