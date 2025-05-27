"use client";
import LinkTabs, { LinkTab } from "@/components/LinkTabs";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

type UsersLayoutProps = PropsWithChildren<{}>;
const UsersLayout = ({ children }: UsersLayoutProps) => {
  const pathname = usePathname();

  return (
    <>
      <LinkTabs>
        <LinkTab href="/users" active={pathname === "/users"}>
          Users List
        </LinkTab>
        <LinkTab href="/users/monitor" active={pathname === "/users/monitor"}>
          Monitor Users
        </LinkTab>
      </LinkTabs>
      <div className="flex-1 h-[calc(100%-3rem)]">
        <div className="h-full w-full">{children}</div>
      </div>
    </>
  );
};

export default UsersLayout;
