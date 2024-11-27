import { Filters } from "@/app/[locale]/(dashboard)/extensions/page";

export const fetchExtensions = async (query: Filters) => {
  const newSearchParams = new URLSearchParams(query);
  const userId = newSearchParams.get("userId");

  await new Promise((resolve) => setTimeout(resolve, 2000));
  const extensions = await fetch(
    `https://jsonplaceholder.typicode.com/todos?userId=${userId}`
  );
  const extensionsData = await extensions.json();
  return extensionsData;
};

export const fetchExtensionsQuery = (query: Filters) => ({
  queryKey: ["extensions", query],
  queryFn: () => fetchExtensions(query),
});
