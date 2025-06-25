import { parseTableInitialParams } from "@/lib/queryParams";
import UsageDetailedTable from "./table";

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
