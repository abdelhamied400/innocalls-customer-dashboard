import { parseTableInitialParams } from "@/lib/queryParams";
import UsageSummaryTable from "./table";

const UsageSummary = async ({ searchParams }: { searchParams: any }) => {
  // Parse filters, sorting, and pagination from URL
  const { page, pageSize, filtersObj, sorting } = await parseTableInitialParams(
    searchParams
  );

  return (
    <div className="page h-full" id="charges">
      <UsageSummaryTable
        initialPagination={{
          pageIndex: Number(page) - 1,
          pageSize: Number(pageSize),
        }}
        initialFilters={filtersObj as any}
        initialSorting={sorting}
      />
    </div>
  );
};

export default UsageSummary;
