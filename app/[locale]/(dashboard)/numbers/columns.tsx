"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Number = {
  id: string;
  number: string;
};

export const columns: ColumnDef<Number>[] = [
  {
    accessorKey: "id",
    header: "#Ref-No",
  },
  {
    accessorKey: "number",
    header: "Phone number",
  },
];
