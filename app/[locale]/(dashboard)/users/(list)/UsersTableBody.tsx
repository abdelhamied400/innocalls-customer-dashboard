import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";
import { columns } from "./columns";
import { getPinningLeftStyles } from "@/lib/table";

interface UsersTableBodyProps {
  table: any;
}

const UsersTableBody = ({ table }: UsersTableBodyProps) => (
  <div className="flex-1 h-full overflow-y-auto">
    <Table className="min-h-full w-full">
      <TableHeader className="bg-gray-100 sticky top-0 z-10">
        {table.getHeaderGroups().map((headerGroup: any) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header: any) => (
              <TableHead
                key={header.id}
                style={
                  header.id === "ext" ? getPinningLeftStyles(header.column) : {}
                }
                className="bg-gray-100"
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row: any) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell: any) => (
                <TableCell
                  key={cell.id}
                  style={
                    cell.column.id === "ext"
                      ? getPinningLeftStyles(cell.column)
                      : {}
                  }
                  className={"bg-white"}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
);

export default UsersTableBody;
