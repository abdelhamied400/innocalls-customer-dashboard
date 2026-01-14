"use client";

import { Cell } from "@/types/cell";
import { Invoice } from "../columns";

const RemainingCell = ({ row }: Cell<Invoice>) => {
  const remaining = row.getValue("remaining") as number;

  return (
    <div className="flex flex-col items-center w-min font-normal">
      <p>{remaining}</p>
    </div>
  );
};

export default RemainingCell;
