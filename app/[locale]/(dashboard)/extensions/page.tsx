import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import ExtensionsTableHead from "./head";
import ExtensionsTable from "./table";
import { getQueryClient } from "@/lib/getQueryClient";
import { fetchExtensionsQuery } from "@/queries/useAutoDialerCampaigns";

type Filters = {
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
    <div className="h-full page" id="extensions">
      <div className="bg-white p-4 rounded-xl h-full overflow-auto">
        <div className="bg-white border rounded-xl">
          <ExtensionsTableHead />

          <div className="w-full">
            <HydrationBoundary state={dehydrate(queryClient)}>
              <ExtensionsTable query={query} />
            </HydrationBoundary>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Extensions;
