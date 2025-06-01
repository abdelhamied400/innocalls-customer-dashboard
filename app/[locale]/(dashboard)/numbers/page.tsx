import numbersService from "@/services/numbers.service";
import NumbersTable from "./table";

type NumbersProps = {
  searchParams: Promise<{}>;
};
const Numbers = async ({}: NumbersProps) => {
  const numbers = await numbersService.fetchNumbers();

  return (
    <div className="page h-full" id="numbers">
      <NumbersTable data={numbers} />
    </div>
  );
};

export default Numbers;
