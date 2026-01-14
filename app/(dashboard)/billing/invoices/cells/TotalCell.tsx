"use client";

import { Cell } from "@/types/cell";
import { Invoice } from "../columns";

const TotalCell = ({ row }: Cell<Invoice>) => {
  const total = row.getValue("total") as number;
  const currencyCode = row.original.currencyCode as string;

  return (
    <div className="flex flex-col items-center w-min font-normal">
      <p>{total}</p>
      <p className="text-gray-500">{currencyCode}</p>
    </div>
  );
};

export default TotalCell;
