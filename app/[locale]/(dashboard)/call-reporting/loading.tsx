import { Skeleton } from "@/components/ui/skeleton";
import TableSkeleton from "@/components/ui/table-skeleton";

const Loading = () => {
  return (
    <div className="loading h-full">
      <div className="h-full flex flex-col">
        <div className="call-reporting-table-head flex items-center justify-between p-4">
          <h2>Call Reporting</h2>
        </div>

        <div className="flex-1 overflow-auto">
          <TableSkeleton />
        </div>

        <div className="pagination mt-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }, (_, index) => (
              <Skeleton key={index} className="h-8 w-8 rounded-full" />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
