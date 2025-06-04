"use client";
import vocabService from "@/services/vocab.service";
import useVocabStore from "@/store/vocab.slice";
import { useSession } from "next-auth/react";
import { PropsWithChildren, useEffect } from "react";

type VocabProviderProps = PropsWithChildren<{}>;
const VocabProvider = ({ children }: VocabProviderProps) => {
  const { setCountries, setDids, setExtensions, setTags } = useVocabStore();
  const { status } = useSession();

  // Fetch countries on mount
  useEffect(() => {
    if (status !== "authenticated") return;
    const fetchCountries = async () => {
      const countries = await vocabService.getAllCountries();
      setCountries(countries);
    };
    const fetchDids = async () => {
      const dids = await vocabService.getAllDids();
      setDids(dids);
    };
    const fetchExtensions = async () => {
      const extensions = await vocabService.getAllExtensions();
      setExtensions(extensions);
    };
    const fetchTags = async () => {
      const tags = await vocabService.getAllTags();
      setTags(tags);
    };

    fetchCountries();
    fetchDids();
    fetchExtensions();
    fetchTags();
  }, [status]);

  return children;
};

export default VocabProvider;
