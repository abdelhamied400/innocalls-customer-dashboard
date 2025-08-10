"use client";
import NumbersTable from "./table";

type NumbersProps = {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    [key: string]: string | undefined;
  }>;
};
const Numbers = ({ searchParams }: NumbersProps) => {
  return (
    <div className="page h-full" id="numbers">
      <NumbersTable />
    </div>
  );
};

export default Numbers;
