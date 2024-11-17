"use client";

import { fetchExtensionsQuery } from "@/queries/extensions";
import { useQuery } from "@tanstack/react-query";
import { Filters } from "./page";

const ExtensionsTable = ({ query }: { query: Filters }) => {
  const { data: extensions, isLoading } = useQuery(fetchExtensionsQuery(query));

  return (
    <div className="table" id="extensions">
      <div className="border-gray-200 bg-white shadow-md p-4 border rounded">
        <p>Extensions Table</p>
      </div>
      {isLoading && <div>Loading...</div>}
      {extensions && <pre>{JSON.stringify(extensions, null, 2)}</pre>}
    </div>
  );
};

export default ExtensionsTable;
