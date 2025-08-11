import React, { useEffect, useState, useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PaginatedTable from "@/components/Table/PaginatedTable";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import { ChevronDown } from "lucide-react";
import { PlayCircle } from "@mui/icons-material";
import { Button } from "@/components/ui/button";
import callReportingService from "@/services/call-reporting.service";
import SoundPlayer from "@/components/SoundPlayer";
import {
  PhoneHistoryResponse,
  PhoneHistoryItem,
} from "@/types/api/call-reporting";
import { PaginatedTableContext } from "@/components/Table/PaginatedTable";
import { Badge } from "@/components/ui/badge";

import {
  ColumnDef,
} from "@tanstack/react-table";

// Direction variants mapping

type BadgeVariant =
  | "default"
  | "muted"
  | "secondary"
  | "destructive"
  | "success"
  | "warning"
  | "outline"
  | "gray";

const directionVariants: Record<string, BadgeVariant> = {
  incoming: "muted",
  outgoing: "success",
};

// Direction Badge Component
const DirectionBadge = ({ direction }: { direction: string }) => {
  const normalizedDirection = direction.toLowerCase();

  const variant: BadgeVariant =
    directionVariants[normalizedDirection] ?? "default";

  return (
    <Badge variant={variant} className="capitalize">
      {direction}
    </Badge>
  );
};

// StatusBadge color logic
const CallAnsweredBadge = ({ answered }: { answered: boolean }) => {
  return (
    <Badge
      className={`capitalize ${
        answered ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {answered ? "Yes" : "No"}
    </Badge>
  );
};


const DateTime = ({ date, time }: { date: string; time: string }) => (
  <div className="flex flex-col">
    <span>{date}</span>
    <span className="text-gray-500 text-xs">{time}</span>
  </div>
);

const ExtCell = ({ ext, name }: { ext: string; name: string }) => (
  <div className="flex flex-col">
    <span>{name}</span>
    <span className="text-gray-500 text-xs">{ext}</span>
  </div>
);

const RecordingCell = ({ callId }: { callId: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);

  const getRecording = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling to row click
    setIsLoading(true);
    try {
      const url = await callReportingService.getCallRecording(callId);
      setRecordingUrl(url);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to get recording:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      // Reset recording URL when modal closes
      setRecordingUrl(null);
    }
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      {" "}
      {/* Prevent any click events from bubbling */}
      <Button
        size="icon"
        variant="ghost-success"
        onClick={getRecording}
        loading={isLoading}
        disabled={isLoading}
      >
        <PlayCircle />
      </Button>
      <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          {" "}
          {/* Prevent modal content clicks from bubbling */}
          <DialogHeader>
            <DialogTitle>Call Recording</DialogTitle>
          </DialogHeader>
          {recordingUrl && (
            <SoundPlayer
              label={recordingUrl.split("/").pop() || "Recording"}
              url={recordingUrl}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface PhoneHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phoneNumber: string;
}

const PAGE_SIZE_OPTIONS = [10, 20, 30];

const PhoneHistoryModal = ({
  open,
  onOpenChange,
  phoneNumber,
}: PhoneHistoryModalProps) => {
  const [data, setData] = useState<PhoneHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && phoneNumber) {
      setLoading(true);
      setError(null);
      callReportingService
        .getPhoneHistory(encodeURIComponent(phoneNumber))
        .then((res: PhoneHistoryResponse) => {
          setData(res.callsHistory || []);
        })
        .catch((err) => {
          setError(
            err?.response?.data?.message ||
              err.message ||
              "Failed to fetch phone history."
          );
        })
        .finally(() => setLoading(false));
    }
    if (!open) {
      setData([]);
      setExpanded(null);
      setError(null);
    }
  }, [open, phoneNumber]);

  // Table columns
  const columns: ColumnDef<PhoneHistoryItem>[] = [
    {
      id: "expander",
      header: "",
      cell: ({ row }) => (
        <div className="w-8 text-center align-middle">
          <ChevronDown
            className={`mx-auto transition-transform duration-200 ${
              expanded === row.original.id ? "rotate-180" : "rotate-0"
            } text-gray-400 hover:text-gray-700 cursor-pointer`}
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(
                expanded === row.original.id ? null : row.original.id
              );
            }}
          />
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
      cell: ({ row }) => <DirectionBadge direction={row.original.direction} />,
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
  ];

  // Custom row rendering for expansion
  const renderSubComponent = (row: PhoneHistoryItem) => (
    <tr>
      <td colSpan={columns.length} className="p-0 border bg-gray-50">
        <div className="p-2">
          <div className="font-semibold mb-2">Call Details</div>
          <div className="max-h-48 overflow-y-auto">
            <table className="w-full text-xs border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-1 border">Answered</th>
                  <th className="p-1 border">Duration</th>
                  <th className="p-1 border">Wait Time</th>
                  <th className="p-1 border">Date</th>
                  <th className="p-1 border">Ext</th>
                </tr>
              </thead>
              <tbody>
                {row.calls.map((call, idx) => (
                  <tr key={idx}>
                    <td className="p-1 border">
                      <CallAnsweredBadge answered={call.answered} />
                    </td>
                    <td className="p-1 border">{call.duration}</td>
                    <td className="p-1 border">{call.holdTime}</td>
                    <td className="p-1 border">
                      <DateTime
                        date={call.dateTime?.date}
                        time={call.dateTime?.time}
                      />
                    </td>
                    <td className="p-1 border">
                      <ExtCell ext={call.ext?.ext} name={call.ext?.name} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </td>
    </tr>
  );

  // Custom row rendering for expansion
  const PhoneHistoryTableBody = ({
    data,
    expanded,
    setExpanded,
    columns,
  }: {
    data: PhoneHistoryItem[];
    expanded: string | null;
    setExpanded: (id: string | null) => void;
    columns: ColumnDef<PhoneHistoryItem>[];
  }) => {
    // Get pagination state from context
    const paginatedTable = useContext(PaginatedTableContext);
    let pageIndex = 0;
    let pageSize = 10;
    if (paginatedTable && paginatedTable.pagination) {
      pageIndex = paginatedTable.pagination.pageIndex;
      pageSize = paginatedTable.pagination.pageSize;
    }
    const paginatedRows = data.slice(
      pageIndex * pageSize,
      (pageIndex + 1) * pageSize
    );
    return (
      <tbody>
        {paginatedRows.map((row) => {
          const isExpanded = expanded === row.id;
          return (
            <React.Fragment key={row.id}>
              <tr
                className={
                  "cursor-pointer hover:bg-gray-50 group transition-all"
                }
                onClick={() => setExpanded(isExpanded ? null : row.id)}
                title="Click to expand/collapse call details"
              >
                {columns.map((col, idx) => {
                  // Expander column
                  if (col.id === "expander") {
                    return (
                      <td
                        key={col.id || idx}
                        className="w-8 text-center align-middle"
                      >
                        <ChevronDown
                          className={`mx-auto transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : "rotate-0"
                          } text-gray-400 hover:text-gray-700 cursor-pointer`}
                        />
                      </td>
                    );
                  }
                  // Custom cell renderer

                  // TODO: FIX THIS ...

                  const cell =
                    typeof col.cell === "function" //@ts-ignore
                      ? col.cell({ row: { original: row } }) //@ts-ignore
                      : row[col.accessorKey as keyof PhoneHistoryItem];

                  //@ts-ignore
                  return <td key={col.id || col.accessorKey || idx}>{cell}</td>;
                })}
              </tr>
              {isExpanded && renderSubComponent(row)}
            </React.Fragment>
          );
        })}
      </tbody>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[80vw] max-w-[80vw] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Phone History for {phoneNumber}</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-500" />
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-600">{error}</div>
        ) : data.length === 0 ? (
          <div className="py-8 text-center">No history found.</div>
        ) : (
          <PaginatedTable
            data={data}
            columns={columns}
            pagination={{
              totalItems: data.length,
              totalPages: Math.ceil(data.length / 10),
            }}
            manualPagination={false}
          >
            <PaginatedTableContent>
              <PaginatedTableHead />
              <PhoneHistoryTableBody
                data={data}
                expanded={expanded}
                setExpanded={setExpanded}
                columns={columns}
              />
            </PaginatedTableContent>
            <PaginatedTablePagination />
            <div className="text-xs text-gray-400 mt-2 flex items-center gap-1">
              <ChevronDown className="inline w-4 h-4" /> Click a row to
              expand/collapse call details
            </div>
          </PaginatedTable>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PhoneHistoryModal;
