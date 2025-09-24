import authService from "@/services/auth.service";
import { useLocalizedQuery } from "./use-localized-query";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

const useAuth = () => {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();

  // Clear cached auth data when user becomes unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      queryClient.removeQueries({ queryKey: ["auth"], exact: false });
    }
  }, [status, queryClient]);

  const userType = session?.userType;
  const userId = (session as any)?.user?.id || (session as any)?.user?.email;

  const userQuery = useLocalizedQuery({
    queryKey: ["auth", userType, userId].filter(Boolean),
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
