"use client";
import vocabService from "@/services/vocab.service";
import useVocabStore from "@/store/vocab.slice";
import { PropsWithChildren, useEffect } from "react";

type VocabProviderProps = PropsWithChildren<{}>;
const VocabProvider = ({ children }: VocabProviderProps) => {
  const { setCountries, setDids } = useVocabStore();

  // Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      const countries = await vocabService.getAllCountries();
      setCountries(countries);
    };
    const fetchDids = async () => {
      const dids = await vocabService.getAllDids();
      setDids(dids);
    };

    fetchCountries();
    fetchDids();
  }, []);

  return children;
};

export default VocabProvider;
