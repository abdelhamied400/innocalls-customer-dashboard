"use client";

import { useParams } from "next/navigation";
import usersService from "@/services/users.service";
import EditUserForm from "./form";
import Spinner from "@/components/ui/spinner";
import withActiveOrganization from "@/containers/withActiveOrganization";
import { useLocalizedQuery } from "@/hooks/use-localized-query";

const EditUser = () => {
  const { userId } = useParams<{ userId: string }>();

  const {
    data: initialUser,
    isLoading,
    error,
  } = useLocalizedQuery({
    queryKey: ["user", userId],
    queryFn: () => usersService.getUserById(userId),
    enabled: !!userId,
  });

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  if (error || !initialUser) return <div>Error loading user.</div>;

  return (
    <div className="page h-screen" id="edit-user">
      <EditUserForm
        initialUser={{
          id: userId,
          ...initialUser,
        }}
      />
    </div>
  );
};

export default withActiveOrganization(EditUser);
