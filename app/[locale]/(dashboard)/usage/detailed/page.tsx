import { parseTableInitialParams } from "@/lib/queryParams";
import UsageDetailedTable from "./table";
import usageService from "@/services/usage.service";
import { isValidDateRange } from "@/lib/date";
import { format } from "date-fns";

// 30 days ago
const defaultFromDate = new Date();
defaultFromDate.setDate(defaultFromDate.getDate() - 30);
// today
const defaultToDate = new Date();

const UsageDetailed = async ({ searchParams }: { searchParams: any }) => {
  // Parse filters, sorting, and pagination from URL
  const { page, pageSize, filtersObj, sorting } = await parseTableInitialParams(
    searchParams
  );

  return (
    <div className="page h-full" id="usage-detailed">
      <UsageDetailedTable
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

export default UsageDetailed;
