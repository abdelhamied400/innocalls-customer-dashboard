import numbersService from "@/services/numbers.service";
import NumbersTable from "./table";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";

type NumbersProps = {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    [key: string]: string | undefined;
  }>;
};
const Numbers = async ({ searchParams }: NumbersProps) => {
  const params = await searchParams;
  const { page = "1", pageSize = "10", ...otherParams } = params;
  // other params will be filters and sorts
  // sorts will start with sort_ and filters will be the rest
  const filters: ColumnFiltersState = [];
  const sorting: SortingState = [];
  Object.entries(otherParams).forEach(([key, value]) => {
    if (key.startsWith("sort_")) {
      const sortKey = key.replace("sort_", "");
      sorting.push({
        id: sortKey,
        desc: value === "desc",
      });
    } else {
      filters.push({
        id: key,
        value: value || "",
      });
    }
  });
  const numbers = await numbersService.fetchNumbers();

  return (
    <div className="page h-full" id="numbers">
      <NumbersTable
        initialData={numbers}
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

export default Numbers;
