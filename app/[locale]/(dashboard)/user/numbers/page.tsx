import numbersService from "@/services/numbers.service";
import NumbersTable from "./table";
import { parseTableInitialParams } from "@/lib/queryParams";

type NumbersProps = {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    [key: string]: string | undefined;
  }>;
};
const Numbers = async ({ searchParams }: NumbersProps) => {
  const { page, pageSize, filters, sorting } = await parseTableInitialParams(
    searchParams
  );
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
