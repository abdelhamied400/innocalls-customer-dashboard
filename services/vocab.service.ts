import { Country } from "@/types/api/country";
import api from "./api";
import { FullTag, Tag } from "@/types/api/tag";
import { Extension } from "@/types/api/extension";
import { ERG } from "@/types/api/erg";

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
  getActiveTags: async (): Promise<Tag[]> => {
    const res = await api.get("/v2/call-tags/active");
    return res.data.callTags;
  },
  getAllTags: async (): Promise<FullTag[]> => {
    const res = await api.get("/call-tag");
    return res.data.callTags;
  },
  getAllAccounts: async () => {
    const res = await api.get("/jera/accounts");
    return res.data;
  },
  getAllPackages: async () => {
    const res = await api.get("/jera/packages");
    return res.data;
  },
  getAllErgs: async (): Promise<ERG[]> => {
    const res = await api.get("/ergs");
    return res.data;
  },
};
