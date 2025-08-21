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
import { useTranslations } from "next-intl";

export const columns = (): ColumnDef<AgentCall>[] => {
  const t = useTranslations("callReporting.columns");

  return [
    {
      accessorKey: "source",
      header: t("source"),
      cell: SourceCell,
    },
    {
      accessorKey: "destination",
      header: t("destination"),
      cell: DestinationCell,
    },
    {
      accessorKey: "datetime",
      header: t("callDate"),
      cell: DateTimeCell,
    },
    {
      accessorKey: "waitTime",
      header: t("waitTime"),
    },
    {
      accessorKey: "duration",
      header: t("callDuration"),
    },
    {
      accessorKey: "call_status",
      header: t("callStatus"),
      cell: CallStatusCell,
    },
    {
      accessorKey: "direction",
      header: t("callDirection"),
      cell: CallDirectionCell,
    },
    {
      accessorKey: "callSummary",
      header: t("callSummary"),
      cell: CallSummaryCell,
    },
    {
      accessorKey: "recording",
      header: t("recording"),
      cell: CallRecordingCell,
    },
  ];
};
