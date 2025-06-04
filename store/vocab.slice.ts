import { Country } from "@/types/api/country";
import { Did } from "@/types/api/did";
import { Extension } from "@/types/api/extension";
import { Tag } from "@/types/api/tag";
import { create } from "zustand";

type VocabState = {
  countries: Country[];
  setCountries: (countries: Country[]) => void;
  dids: Did[];
  setDids: (dids: Did[]) => void;
  extensions: Extension[];
  setExtensions: (extensions: Extension[]) => void;
  tags: Tag[];
  setTags: (tags: Tag[]) => void;
};

const useVocabStore = create<VocabState>()((set) => ({
  countries: [],
  setCountries: (countries) => set(() => ({ countries })),
  dids: [],
  setDids: (dids) => set(() => ({ dids })),
  extensions: [],
  setExtensions: (extensions) => set(() => ({ extensions })),
  tags: [],
  setTags: (tags) => set(() => ({ tags })),
}));

export default useVocabStore;
