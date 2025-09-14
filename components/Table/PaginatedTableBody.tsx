"use client";

import { flexRender, Row } from "@tanstack/react-table";
import { TableBody, TableCell, TableRow } from "../ui/table";
import { usePaginatedTable } from "./PaginatedTable";
import { useTranslations } from "@/providers/TranslationProvider";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

type PaginatedTableBodyProps<T> = {
  renderDetails?: (row: Row<T>) => React.ReactNode;
  sticky?: boolean;
};
const PaginatedTableBody = <T,>({
  renderDetails,
  sticky,
}: PaginatedTableBodyProps<T>) => {
  const { table } = usePaginatedTable<T, any>();

  const t = useTranslations("common.search");

  return (
    <TableBody>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <Fragment key={row.id}>
            <TableRow
              data-state={row.getIsSelected() && "selected"}
              className={cn(
                "h-14",
                sticky &&
                  "sticky top-9 z-30 bg-white shadow-lg border-b shadow-gray-100"
              )}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
            {row.getIsExpanded() && (
              <TableRow>
                <TableCell colSpan={row.getVisibleCells().length}>
                  {renderDetails?.(row)}
                </TableCell>
              </TableRow>
            )}
          </Fragment>
        ))
      ) : (
        <TableRow>
          <TableCell
            colSpan={table.getAllColumns().length}
            className="h-24 text-center"
          >
            {t("noResults")}
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};

export default PaginatedTableBody;
