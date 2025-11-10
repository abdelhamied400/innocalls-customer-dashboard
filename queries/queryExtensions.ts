import extensionsService from "@/services/extensions.service";

type ExtensionsFilters = object;
const queryExtensions = (filters: ExtensionsFilters) => {
  return {
    queryKey: ["extensions", filters],
    queryFn: () => extensionsService.listExtensions(filters),
  };
};

export default queryExtensions;
