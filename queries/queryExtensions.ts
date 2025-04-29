import extensionsService from "@/services/extensions.service";

type ExtensionsFilters = {};
const queryExtensions = (filters: ExtensionsFilters) => {
  return {
    queryKey: ["extensions", filters],
    queryFn: () => extensionsService.listExtensions(filters),
  };
};

export default queryExtensions;
