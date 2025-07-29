"use client";
import Spinner from "@/components/ui/spinner";
import vocabService from "@/services/vocab.service";
import useAuthStore from "@/store/auth.slice";
import useVocabStore from "@/store/vocab.slice";
import { useSession } from "next-auth/react";
import { PropsWithChildren, useEffect, useRef, useState } from "react";

type VocabProviderProps = PropsWithChildren<{}>;
const VocabProvider = ({ children }: VocabProviderProps) => {
  const [loading, setLoading] = useState(false);
  const {
    setCountries,
    setDids,
    setExtensions,
    setTags,
    setAccounts,
    setPackages,
    setErgs,
  } = useVocabStore();
  const { data: user, status } = useSession();
  const { Organization } = useAuthStore();
  const didFetch = useRef(false);

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
  const fetchErgs = async () => {
    const ergs = await vocabService.getAllErgs();
    setErgs(ergs);
  };

  const fetchUserVocab = async () => {
    const promises = [
      fetchCountries(),
      fetchDids(),
      fetchExtensions(),
      fetchTags(),
      fetchAccounts(),
      fetchPackages(),
      fetchErgs(),
    ];
    try {
      setLoading(true);
      await Promise.all(promises);
    } catch (error) {
      console.error("Error fetching user vocab:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgentVocab = async () => {
    const promises = [fetchCountries()];
    try {
      setLoading(true);
      await Promise.all(promises);
    } catch (error) {
      console.error("Error fetching agent vocab:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch countries on mount
  useEffect(() => {
    if (status !== "authenticated" || didFetch.current) return;

    didFetch.current = true;

    if (!!Organization) {
      if (user?.user?.role === "agent") {
        fetchAgentVocab();
      } else {
        fetchUserVocab();
      }
    }
  }, [status, Organization]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Spinner />
        <span className="text-gray-500">Authenticating...</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Spinner />
        <span className="text-gray-500">Loading vocab...</span>
      </div>
    );
  }

  return children;
};

export default VocabProvider;
