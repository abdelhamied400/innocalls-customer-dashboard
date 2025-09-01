"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import usersService from "@/services/users.service";
import EditUserForm from "./form";
import Spinner from "@/components/ui/spinner";

const EditUser = () => {
  const { userId } = useParams<{ userId: string }>();

  const {
    data: initialUser,
    isLoading,
    error,
  } = useQuery({
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

export default EditUser;
