import { Extension } from "@/types/api/extension";
import api from "./api";

type ListExtensionsFilters = {};
export default {
  listExtensions: async (
    filters: ListExtensionsFilters
  ): Promise<Extension[]> => {
    const res = await api.get("/extension/list", { params: filters });
    return res.data;
  },
};
