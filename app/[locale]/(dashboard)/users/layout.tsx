"use client";
import LinkTabs, { LinkTab } from "@/components/LinkTabs";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

type UsersLayoutProps = PropsWithChildren<{}>;
const UsersLayout = ({ children }: UsersLayoutProps) => {
  const pathname = usePathname();

  return (
    <div className="bg-white rounded-xl p-4">
      <LinkTabs>
        <LinkTab href="/users" active={pathname === "/users"}>
          Users List
        </LinkTab>
        <LinkTab href="/users/monitor" active={pathname === "/users/monitor"}>
          Monitor Users
        </LinkTab>
      </LinkTabs>
      {children}
    </div>
  );
};

export default UsersLayout;
