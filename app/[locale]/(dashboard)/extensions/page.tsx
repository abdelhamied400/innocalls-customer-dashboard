import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import ExtensionsFilters from "./filters";
import ExtensionsTable from "./table";
import { getQueryClient } from "@/lib/getQueryClient";
import { fetchExtensionsQuery } from "@/queries/extensions";

export type Filters = {
  userId: string;
};
type ExtensionsProps = {
  searchParams: Promise<Filters>;
};
const Extensions = async ({ searchParams }: ExtensionsProps) => {
  const queryClient = getQueryClient();
  const query = await searchParams;
  queryClient.prefetchQuery(fetchExtensionsQuery(query));

  return (
    <div className="page" id="extensions">
      <div className="border-gray-200 bg-white shadow-md p-4 border rounded">
        <p>Extensions</p>
      </div>

      <ExtensionsFilters />

      <HydrationBoundary state={dehydrate(queryClient)}>
        <ExtensionsTable query={query} />
      </HydrationBoundary>
    </div>
  );
};

export default Extensions;
