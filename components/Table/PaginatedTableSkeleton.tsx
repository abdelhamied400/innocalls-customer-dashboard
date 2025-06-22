import { Skeleton } from "../ui/skeleton";
import { TableBody, TableCell, TableRow } from "../ui/table";
import { usePaginatedTable } from "./PaginatedTable";

type PaginatedTableSkeletonProps = {
  rows?: number;
};
const PaginatedTableSkeleton = ({ rows = 20 }: PaginatedTableSkeletonProps) => {
  const { columns } = usePaginatedTable();

  return (
    <TableBody className="paginated-table-skeleton">
      {[...Array(rows)].map((_, rIdx) => (
        <TableRow key={`loading-${rIdx}`} className="h-14">
          {[...Array(columns.length || 5)].map((_, cIdx) => (
            <TableCell key={`loading-${cIdx}`} className="h-10">
              <Skeleton className="w-full h-10" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
};

export default PaginatedTableSkeleton;
