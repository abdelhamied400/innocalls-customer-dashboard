import { Country } from "@/types/api/country";
import api from "./api";
import { Did } from "@/types/api/did";

export default {
  getAllCountries: async () => {
    const res = await api.get<Country[]>("/country");
    return res.data;
  },
  getAllDids: async () => {
    const res = await api.get<string[]>("/jera/dids");
    return res.data.map((did) => ({ id: did, name: did }));
  },
};
