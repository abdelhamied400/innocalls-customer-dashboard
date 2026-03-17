"use client";
import { Call } from "@/types/api/call-reporting";
import { ColumnDef } from "@tanstack/react-table";
import CallSummaryCell from "./cells/CallSummaryCell";
import DestinationCell from "./cells/DestinationCell";
import SourceCell from "./cells/SourceCell";
import DateTimeCell from "./cells/DateTimeCell";
import CallStatusCell from "./cells/CallStatusCell";
import CallDirectionCell from "./cells/CallDirectionCell";
import CallRecordingCell from "./cells/CallRecordingCell";
import TranscriptionCell from "./cells/TranscriptionCell";
import TranscriptionSummaryCell from "./cells/TranscriptionSummaryCell";
import { useTranslations } from "@/providers/TranslationProvider";

type ColumnsOptions = {
  enableCallTranscription?: boolean;
};

export const columns = (
  t: ReturnType<typeof useTranslations>,
  options: ColumnsOptions = {}
): ColumnDef<Call>[] => {
  const cols: ColumnDef<Call>[] = [
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

  if (options.enableCallTranscription) {
    cols.push(
      {
        id: "transcriptionSummary",
        header: t("columns.aiSummary"),
        cell: TranscriptionSummaryCell,
      },
      {
        id: "transcription",
        header: t("columns.transcription"),
        cell: TranscriptionCell,
      }
    );
  }

  return cols;
};
