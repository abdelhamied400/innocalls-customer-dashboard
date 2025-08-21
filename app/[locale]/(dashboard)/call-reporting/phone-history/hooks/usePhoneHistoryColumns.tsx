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
import { useTranslations } from "next-intl";

export const usePhoneHistoryColumns = (): ColumnDef<PhoneHistoryItem>[] => {
  const t = useTranslations("callReporting.phoneHistory.table.columns");

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
        header: t("date"),
        cell: ({ row }) => (
          <DateTime
            date={row.original.latestTime?.date}
            time={row.original.latestTime?.time}
          />
        ),
      },
      {
        accessorKey: "direction",
        header: t("direction"),
        cell: ({ row }) => (
          <DirectionBadge direction={row.original.direction} />
        ),
      },
      {
        accessorKey: "isAnswered",
        header: t("answered"),
        cell: ({ row }) => (
          <CallAnsweredBadge answered={row.original.isAnswered} />
        ),
      },
      {
        accessorKey: "duration",
        header: t("duration"),
        cell: ({ row }) => row.original.duration,
      },
      {
        accessorKey: "totalHoldTime",
        header: t("totalWaitTime"),
        cell: ({ row }) => row.original.totalHoldTime,
      },
      {
        accessorKey: "recording",
        header: t("recording"),
        cell: ({ row }) =>
          row.original.hasRecording ? (
            <RecordingCell callId={row.original.id} />
          ) : null,
      },
    ],
    []
  );
};
