import CallReportingTable from "./table";
import callReportingService from "@/services/call-reporting.service";
import { parseTableInitialParams } from "@/lib/queryParams";

const CallReporting = async ({ searchParams }: { searchParams: any }) => {
  // Parse filters, sorting, and pagination from URL
  const { page, pageSize, filters, sorting } = await parseTableInitialParams(
    searchParams
  );

  // Fetch data from the service
  const data = await callReportingService.getCallReporting(
    Number(page),
    Number(pageSize),
    filters
  );

  return (
    <div className="page h-full" id="call-reporting">
      <CallReportingTable
        initialData={data}
        initialPagination={{
          pageIndex: Number(page) - 1,
          pageSize: Number(pageSize),
        }}
        initialFilters={filters}
        initialSorting={sorting}
      />
    </div>
  );
};

export default CallReporting;
