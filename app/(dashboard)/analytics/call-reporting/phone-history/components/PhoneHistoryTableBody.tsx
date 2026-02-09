import React, { useContext } from "react";
import { ChevronDown } from "lucide-react";
import { PhoneHistoryItem } from "@/types/api/call-reporting";
import { PaginatedTableContext } from "@/components/Table/PaginatedTable";
import { PhoneHistoryTableBodyProps } from "../types";
import { CallAnsweredBadge, DateTime, ExtCell } from "./index";
import { Add, Remove } from "@mui/icons-material";
import { useTranslations } from "@/providers/TranslationProvider";

const renderSubComponent = (
  row: PhoneHistoryItem,
  columnsLength: number,
  t: any
) => (
  <tr>
    <td colSpan={columnsLength} className="p-0 border bg-gray-50">
      <div className="p-2">
        <div className="font-semibold mb-2">{t("callDetails.title")}</div>
        <div className="max-h-48 overflow-y-auto">
          <table className="w-full text-xs border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-1 border">
                  {t("callDetails.columns.answered")}
                </th>
                <th className="p-1 border">
                  {t("callDetails.columns.duration")}
                </th>
                <th className="p-1 border">
                  {t("callDetails.columns.waitTime")}
                </th>
                <th className="p-1 border">{t("callDetails.columns.date")}</th>
                <th className="p-1 border">{t("callDetails.columns.user")}</th>
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
  const t = useTranslations("callReporting.phoneHistory");

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
              title={t("actions.clickToToggle")}
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
                    ? //@ts-expect-error -- dynamic cell renderer
                      col.cell({ row: { original: row } })
                    : //@ts-expect-error -- dynamic accessor key
                      row[col.accessorKey as keyof PhoneHistoryItem];

                return (
                  //@ts-expect-error -- dynamic key from column def
                  <td key={col.id || col.accessorKey || idx}>{cell}</td>
                );
              })}
            </tr>
            {isExpanded && renderSubComponent(row, columns.length, t)}
          </React.Fragment>
        );
      })}
    </tbody>
  );
};
