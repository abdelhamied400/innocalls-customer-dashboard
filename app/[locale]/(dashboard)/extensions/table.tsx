"use client";

import { fetchExtensionsQuery } from "@/queries/extensions";
import { useQuery } from "@tanstack/react-query";
import { Filters } from "./page";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

const ExtensionsTable = ({ query }: { query: Filters }) => {
  const { data: extensions, isLoading } = useQuery(fetchExtensionsQuery(query));

  return (
    <div className="w-full extensions-table" id="extensions">
      <DataTable columns={columns} data={extensions} isLoading={isLoading} />
    </div>
  );
};

export default ExtensionsTable;
