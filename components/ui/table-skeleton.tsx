import { Skeleton } from "./skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TableSkeletonProps = {
  rows?: number;
  cols?: number;
  className?: string;
};
const TableSkeleton = ({
  rows = 5,
  cols = 4,
  className = "",
}: TableSkeletonProps) => {
  return (
    <Table className={`w-full ${className}`}>
      <TableHeader>
        <TableRow>
          {Array.from({ length: cols }, (_, index) => (
            <TableHead key={index}>
              <Skeleton className="h-4 w-24" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }, (_, index) => (
          <TableRow key={index}>
            {Array.from({ length: cols }, (_, colIndex) => (
              <TableCell key={colIndex}>
                <Skeleton className="h-6 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableSkeleton;
