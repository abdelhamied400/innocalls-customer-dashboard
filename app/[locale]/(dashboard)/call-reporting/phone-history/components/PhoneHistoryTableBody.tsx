import React, { useContext } from "react";
import { ChevronDown } from "lucide-react";
import { PhoneHistoryItem } from "@/types/api/call-reporting";
import { PaginatedTableContext } from "@/components/Table/PaginatedTable";
import { PhoneHistoryTableBodyProps } from "../types";
import { CallAnsweredBadge, DateTime, ExtCell } from "./index";
import { Add, Remove } from "@mui/icons-material";

const renderSubComponent = (row: PhoneHistoryItem, columnsLength: number) => (
  <tr>
    <td colSpan={columnsLength} className="p-0 border bg-gray-50">
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

export const PhoneHistoryTableBody = ({
  data,
  expanded,
  setExpanded,
  columns,
}: PhoneHistoryTableBodyProps) => {
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
              className="cursor-pointer hover:bg-gray-50 group transition-all"
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
                      {isExpanded && (
                        <Remove className="!w-4 text-gray-400 hover:text-gray-700 cursor-pointer" />
                      )}
                      {!isExpanded && (
                        <Add className="!w-4 text-gray-400 hover:text-gray-700 cursor-pointer" />
                      )}
                    </td>
                  );
                }

                // Custom cell renderer
                const cell =
                  typeof col.cell === "function"
                    ? //@ts-ignore
                      col.cell({ row: { original: row } })
                    : //@ts-ignore
                      row[col.accessorKey as keyof PhoneHistoryItem];

                return (
                  //@ts-ignore
                  <td key={col.id || col.accessorKey || idx}>{cell}</td>
                );
              })}
            </tr>
            {isExpanded && renderSubComponent(row, columns.length)}
          </React.Fragment>
        );
      })}
    </tbody>
  );
};
