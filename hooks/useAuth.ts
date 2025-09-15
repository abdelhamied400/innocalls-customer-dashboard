import authService from "@/services/auth.service";
import { useLocalizedQuery } from "./use-localized-query";
import { useSession } from "next-auth/react";

const useAuth = () => {
  const { data: session, status } = useSession();
  const userQuery = useLocalizedQuery({
    queryKey: ["auth", session?.userType],
    queryFn:
      session?.userType === "agent"
        ? authService.fetchAgentProfile
        : authService.fetchUserProfile,
    enabled: status === "authenticated",
  });

  return userQuery;
};

export default useAuth;
