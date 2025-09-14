import { useSession } from "next-auth/react";
import useAuthStore from "@/store/auth.slice";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import vocabService from "@/services/vocab.service";

export function useVocab() {
  const { data: session } = useSession();
  const { Organization } = useAuthStore();

  const { data: countries = [], isLoading: countriesLoading } =
    useLocalizedQuery({
      queryKey: ["countries"],
      queryFn: vocabService.getAllCountries,
    });
  const { data: tags = [], isLoading: tagsLoading } = useLocalizedQuery({
    queryKey: ["tags"],
    queryFn: vocabService.getAllTags,
  });
  const { data: accounts = [], isLoading: accountsLoading } = useLocalizedQuery(
    {
      queryKey: ["accounts"],
      queryFn: vocabService.getAllAccounts,
      enabled:
        !!Organization &&
        !!session?.user?.userType &&
        session.user.userType === "user",
    }
  );
  const { data: packages = [], isLoading: packagesLoading } = useLocalizedQuery(
    {
      queryKey: ["packages"],
      queryFn: vocabService.getAllPackages,
      enabled:
        !!Organization &&
        !!session?.user?.userType &&
        session.user.userType === "user",
    }
  );
  const { data: ergs = [], isLoading: ergsLoading } = useLocalizedQuery({
    queryKey: ["ergs"],
    queryFn: vocabService.getAllErgs,
    enabled:
      !!Organization &&
      !!session?.user?.userType &&
      session.user.userType === "user",
  });
  const { data: dids = [], isLoading: didsLoading } = useLocalizedQuery({
    queryKey: ["dids"],
    queryFn: vocabService.getAllDids,
    enabled: !!Organization && !!session?.user?.fullAccessNumbers,
  });
  const { data: extensions = [], isLoading: extensionsLoading } =
    useLocalizedQuery({
      queryKey: ["extensions"],
      queryFn: vocabService.getAllExtensions,
      enabled: !!Organization && !!session?.user?.agentsAccessControl,
    });

  const loading = [
    countriesLoading,
    tagsLoading,
    accountsLoading,
    packagesLoading,
    ergsLoading,
    didsLoading,
    extensionsLoading,
  ].some(Boolean);

  return {
    countries,
    tags,
    accounts,
    packages,
    ergs,
    dids,
    extensions,
    loading,
  };
}
