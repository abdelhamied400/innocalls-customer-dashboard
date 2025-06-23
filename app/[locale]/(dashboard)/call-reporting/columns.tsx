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

export const columns: ColumnDef<Call>[] = [
  {
    accessorKey: "destination",
    header: "Destination",
    cell: DestinationCell,
  },
  {
    accessorKey: "source",
    header: "Source",
    cell: SourceCell,
  },
  {
    accessorKey: "datetime",
    header: "Call Date",
    cell: DateTimeCell,
  },
  {
    accessorKey: "duration",
    header: "Call Duration",
  },
  {
    accessorKey: "call_status",
    header: "Call Status",
    cell: CallStatusCell,
  },
  {
    accessorKey: "direction",
    header: "Call Direction",
    cell: CallDirectionCell,
  },
  {
    accessorKey: "callSummary",
    header: "Call Summary",
    cell: CallSummaryCell,
  },
  {
    accessorKey: "recording",
    header: "Recording",
    cell: CallRecordingCell,
  },
];
