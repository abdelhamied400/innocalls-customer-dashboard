"use client";
import vocabService from "@/services/vocab.service";
import useVocabStore from "@/store/vocab.slice";
import { useSession } from "next-auth/react";
import { PropsWithChildren, useEffect } from "react";

type VocabProviderProps = PropsWithChildren<{}>;
const VocabProvider = ({ children }: VocabProviderProps) => {
  const {
    setCountries,
    setDids,
    setExtensions,
    setTags,
    setAccounts,
    setPackages,
  } = useVocabStore();
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
    const fetchAccounts = async () => {
      const accounts = await vocabService.getAllAccounts();
      setAccounts(accounts);
    };
    const fetchPackages = async () => {
      const packages = await vocabService.getAllPackages();
      setPackages(packages);
    };

    fetchCountries();
    fetchDids();
    fetchExtensions();
    fetchTags();
    fetchAccounts();
    fetchPackages();
  }, [status]);

  return children;
};

export default VocabProvider;
