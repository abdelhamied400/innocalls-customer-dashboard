"use client";

import { flexRender } from "@tanstack/react-table";
import { TableBody, TableCell, TableRow } from "../ui/table";
import { usePaginatedTable } from "./PaginatedTable";
import { useTranslations } from "next-intl";

const PaginatedTableBody = () => {
  const { table } = usePaginatedTable();

  const t = useTranslations("common.search");

  return (
    <TableBody>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <TableRow
            key={row.id}
            data-state={row.getIsSelected() && "selected"}
            className="h-14"
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
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
