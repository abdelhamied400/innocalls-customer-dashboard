"use client";
import hasTenant from "@/containers/hasTenant";
import withPermission from "@/containers/withPermission";
import { PropsWithChildren } from "react";

type UsersLayoutProps = PropsWithChildren<{
  createSheet: React.ReactNode;
}>;
const UsersLayout = ({ children, createSheet }: UsersLayoutProps) => {
  return (
    <div className="users-layout bg-white rounded-xl h-full flex flex-col gap-3 p-4">
      {createSheet}
      {children}
    </div>
  );
};

export default hasTenant(withPermission(UsersLayout, "agentsAccessControl"));
