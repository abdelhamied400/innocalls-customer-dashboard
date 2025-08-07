import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import callReportingService from "@/services/call-reporting.service";
import {
  PhoneHistoryResponse,
  PhoneHistoryItem,
} from "@/types/api/call-reporting";
import { ChevronDown } from "lucide-react";
import usePagination from "@/hooks/use-pagination";
import React from "react";

interface PhoneHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phoneNumber: string;
}

const getDirectionColor = (direction: string) => {
  if (
    direction.toLowerCase() === "inbound" ||
    direction.toLowerCase() === "incoming"
  )
    return "text-green-600";
  if (
    direction.toLowerCase() === "outbound" ||
    direction.toLowerCase() === "outgoing"
  )
    return "text-blue-600";
  return "text-gray-600";
};

const getAnsweredColor = (answered: boolean) =>
  answered
    ? "bg-green-100 text-green-700 px-2 py-1 rounded"
    : "bg-red-100 text-red-700 px-2 py-1 rounded";

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

  // Pagination state
  const { pageIndex, pageSize, setPagination, pages } = usePagination({
    totalItems: data.length,
    perPage: 10,
    defaultPageIndex: 0,
  });

  const paginatedData = data.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize
  );

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>Phone History for {phoneNumber}</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="py-8 text-center">Loading...</div>
        ) : error ? (
          <div className="py-8 text-center text-red-600">{error}</div>
        ) : data.length === 0 ? (
          <div className="py-8 text-center">No history found.</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Direction</TableHead>
                  <TableHead>Answered</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Total Wait Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((item) => {
                  const isExpanded = expanded === item.id;
                  return (
                    <React.Fragment key={item.id}>
                      <TableRow
                        className={`cursor-pointer hover:bg-gray-50 group transition-all`}
                        onClick={() => setExpanded(isExpanded ? null : item.id)}
                        title="Click to expand/collapse call details"
                      >
                        <TableCell className="w-8 text-center align-middle">
                          <ChevronDown
                            className={`mx-auto transition-transform duration-200 ${
                              isExpanded ? "rotate-180" : "rotate-0"
                            } text-gray-400 group-hover:text-gray-700`}
                          />
                        </TableCell>
                        <TableCell>
                          <DateTime
                            date={item.latestTime.date}
                            time={item.latestTime.time}
                          />
                        </TableCell>
                        <TableCell>
                          <span className={getDirectionColor(item.direction)}>
                            {item.direction}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={getAnsweredColor(item.isAnswered)}>
                            {item.isAnswered ? "Yes" : "No"}
                          </span>
                        </TableCell>
                        <TableCell>{item.duration}</TableCell>
                        <TableCell>{item.totalHoldTime}</TableCell>
                      </TableRow>
                      {isExpanded && (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="p-0 border bg-gray-50"
                          >
                            <div className="p-2">
                              <div className="font-semibold mb-2">
                                Call Details
                              </div>
                              <div className="max-h-48 overflow-y-auto">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Answered</TableHead>
                                      <TableHead>Duration</TableHead>
                                      <TableHead>Wait Time</TableHead>
                                      <TableHead>Date</TableHead>
                                      <TableHead>Ext</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {item.calls.map((call, idx) => (
                                      <TableRow key={idx}>
                                        <TableCell>
                                          <span
                                            className={getAnsweredColor(
                                              call.answered
                                            )}
                                          >
                                            {call.answered ? "Yes" : "No"}
                                          </span>
                                        </TableCell>
                                        <TableCell>{call.duration}</TableCell>
                                        <TableCell>{call.holdTime}</TableCell>
                                        <TableCell>
                                          <DateTime
                                            date={call.dateTime.date}
                                            time={call.dateTime.time}
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <ExtCell
                                            ext={call.ext.ext}
                                            name={call.ext.name}
                                          />
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
            {/* Pagination Controls */}
            <div className="flex flex-wrap justify-between items-center gap-2 p-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Rows per page:</span>
                <select
                  className="border rounded px-2 py-1 text-xs"
                  value={pageSize}
                  onChange={(e) =>
                    setPagination((p) => ({
                      ...p,
                      pageSize: Number(e.target.value),
                      pageIndex: 0,
                    }))
                  }
                >
                  {PAGE_SIZE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-2 py-1 text-xs border rounded disabled:opacity-50"
                  onClick={() =>
                    setPagination((p) => ({
                      ...p,
                      pageIndex: Math.max(0, p.pageIndex - 1),
                    }))
                  }
                  disabled={pageIndex === 0}
                >
                  Previous
                </button>
                <span className="text-xs text-gray-500">
                  {pageIndex * pageSize + 1}-
                  {Math.min((pageIndex + 1) * pageSize, data.length)} of{" "}
                  {data.length}
                </span>
                <button
                  className="px-2 py-1 text-xs border rounded disabled:opacity-50"
                  onClick={() =>
                    setPagination((p) => ({
                      ...p,
                      pageIndex: Math.min(
                        Math.ceil(data.length / pageSize) - 1,
                        p.pageIndex + 1
                      ),
                    }))
                  }
                  disabled={(pageIndex + 1) * pageSize >= data.length}
                >
                  Next
                </button>
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-2 flex items-center gap-1">
              <ChevronDown className="inline w-4 h-4" /> Click a row to
              expand/collapse call details
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PhoneHistoryModal;
