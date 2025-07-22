import { Account } from "@/types/api/account";
import { Country } from "@/types/api/country";
import { Did } from "@/types/api/did";
import { ERG } from "@/types/api/erg";
import { Extension } from "@/types/api/extension";
import { Package } from "@/types/api/package";
import { Tag } from "@/types/api/tag";
import { create } from "zustand";

type VocabState = {
  countries: Country[];
  dids: Did[];
  extensions: Extension[];
  tags: Tag[];
  accounts?: Account[];
  packages?: Package[];
  ergs?: ERG[];
  setCountries: (countries: Country[]) => void;
  setDids: (dids: Did[]) => void;
  setExtensions: (extensions: Extension[]) => void;
  setTags: (tags: Tag[]) => void;
  setAccounts: (accounts: Account[]) => void;
  setPackages: (packages: Package[]) => void;
  setErgs: (ergs: ERG[]) => void;
};

const useVocabStore = create<VocabState>()((set) => ({
  countries: [],
  dids: [],
  extensions: [],
  tags: [],
  accounts: [],
  packages: [],
  ergs: [],
  setCountries: (countries) => set(() => ({ countries })),
  setDids: (dids) => set(() => ({ dids })),
  setExtensions: (extensions) => set(() => ({ extensions })),
  setTags: (tags) => set(() => ({ tags })),
  setAccounts: (accounts) => set(() => ({ accounts })),
  setPackages: (packages) => set(() => ({ packages })),
  setErgs: (ergs) => set(() => ({ ergs })),
}));

export default useVocabStore;
