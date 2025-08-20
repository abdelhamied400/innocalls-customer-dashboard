import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { PhoneHistoryItem } from "@/types/api/call-reporting";
import {
  DirectionBadge,
  CallAnsweredBadge,
  DateTime,
  RecordingCell,
} from "../components";

export const usePhoneHistoryColumns = (): ColumnDef<PhoneHistoryItem>[] => {
  return useMemo(
    () => [
      {
        id: "expander",
        header: "",
        cell: ({ row }) => (
          <div className="w-8 text-center align-middle">
            <ChevronDown className="mx-auto transition-transform duration-200 text-gray-400 hover:text-gray-700 cursor-pointer" />
          </div>
        ),
      },
      {
        accessorKey: "latestTime",
        header: "Date",
        cell: ({ row }) => (
          <DateTime
            date={row.original.latestTime?.date}
            time={row.original.latestTime?.time}
          />
        ),
      },
      {
        accessorKey: "direction",
        header: "Direction",
        cell: ({ row }) => (
          <DirectionBadge direction={row.original.direction} />
        ),
      },
      {
        accessorKey: "isAnswered",
        header: "Answered",
        cell: ({ row }) => (
          <CallAnsweredBadge answered={row.original.isAnswered} />
        ),
      },
      {
        accessorKey: "duration",
        header: "Duration",
        cell: ({ row }) => row.original.duration,
      },
      {
        accessorKey: "totalHoldTime",
        header: "Total Wait Time",
        cell: ({ row }) => row.original.totalHoldTime,
      },
      {
        accessorKey: "recording",
        header: "Recording",
        cell: ({ row }) =>
          row.original.hasRecording ? (
            <RecordingCell callId={row.original.id} />
          ) : null,
      },
    ],
    []
  );
};
