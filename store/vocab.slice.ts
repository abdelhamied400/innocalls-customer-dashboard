import { Country } from "@/types/api/country";
import { Did } from "@/types/api/did";
import { create } from "zustand";

type VocabState = {
  countries: Country[];
  setCountries: (countries: Country[]) => void;
  dids: Did[];
  setDids: (dids: Did[]) => void;
};

const useVocabStore = create<VocabState>()((set) => ({
  countries: [],
  setCountries: (countries) => set(() => ({ countries })),
  dids: [],
  setDids: (dids) => set(() => ({ dids })),
}));

export default useVocabStore;
