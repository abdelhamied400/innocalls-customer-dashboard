import authService from "@/services/auth.service";
import { useSession } from "@/hooks/useSession";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "@/providers/TranslationProvider";
import useAuthStore from "@/store/auth.slice";

const useAuth = () => {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const locale = useLocale();
  const { Organization } = useAuthStore();

  // Clear cached auth data when user becomes unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      queryClient.removeQueries({ queryKey: ["auth"], exact: false });
    }
  }, [status, queryClient]);

  const userType = session?.userType;
  const userId = session?.user?.id || session?.user?.email;

  // Use useQuery directly to avoid circular dependency with useLocalizedQuery
  const userQuery = useQuery({
    queryKey: ["auth", userType, userId, locale, Organization?.id].filter(Boolean),
    queryFn:
      userType === "agent"
        ? authService.fetchAgentProfile
        : authService.fetchUserProfile,
    enabled: status === "authenticated" && !!userType,
    staleTime: 0,
    gcTime: 0,
  });

  return userQuery;
};

export default useAuth;
