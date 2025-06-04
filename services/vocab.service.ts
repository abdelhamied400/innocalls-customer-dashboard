import { Country } from "@/types/api/country";
import api from "./api";
import { Tag } from "@/types/api/tag";
import { Extension } from "@/types/api/extension";

export default {
  getAllCountries: async () => {
    const res = await api.get<Country[]>("/country");
    return res.data;
  },
  getAllDids: async () => {
    const res = await api.get<string[]>("/jera/dids");
    return res.data.map((did) => ({ id: did, name: did }));
  },
  getAllExtensions: async (): Promise<Extension[]> => {
    const res = await api.get("/extension/list");
    return res.data;
  },
  getAllTags: async (): Promise<Tag[]> => {
    const res = await api.get("/call-tag");
    return res.data.callTags;
  },
};
