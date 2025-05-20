import numbersService from "@/services/numbers.service";
import NumbersTable from "./table";
import NumbersTableHead from "./head";

type NumbersProps = {
  searchParams: Promise<{
    page: string;
    pageSize: string;
  }>;
};
const Numbers = async ({ searchParams }: NumbersProps) => {
  const { page = "1", pageSize = "10", ...filters } = await searchParams;
  const numbers = await numbersService.fetchNumbers(page, pageSize, filters);

  return (
    <div className="page" id="numbers">
      <div className="bg-white rounded-xl p-4">
        <div className="border rounded-xl">
          <NumbersTableHead />
          <NumbersTable
            data={numbers}
            initialPagination={{
              pageIndex: parseInt(page) - 1,
              pageSize: parseInt(pageSize),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Numbers;
