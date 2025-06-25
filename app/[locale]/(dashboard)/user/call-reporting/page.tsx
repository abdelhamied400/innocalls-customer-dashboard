import CallReportingTable from "./table";
import { parseTableInitialParams } from "@/lib/queryParams";

const CallReporting = async ({ searchParams }: { searchParams: any }) => {
  // Parse filters, sorting, and pagination from URL
  const { page, pageSize, filtersObj, sorting } = await parseTableInitialParams(
    searchParams
  );

  return (
    <div className="page h-full" id="call-reporting">
      <CallReportingTable
        initialPagination={{
          pageIndex: Number(page) - 1,
          pageSize: Number(pageSize),
        }}
        initialFilters={filtersObj}
        initialSorting={sorting}
      />
    </div>
  );
};

export default CallReporting;
