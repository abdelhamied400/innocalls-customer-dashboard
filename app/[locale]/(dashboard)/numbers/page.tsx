import numbersService from "@/services/numbers.service";
import NumbersTable from "./table";
import { columns } from "./columns";

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
    <div className="page h-full" id="numbers">
      <NumbersTable data={numbers} />
    </div>
  );
};

export default Numbers;
