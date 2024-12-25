"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren, ReactNode, useMemo } from "react";

type SidebarItemProps = PropsWithChildren<{
  icon?: ReactNode;
  title?: string;
  href: string;
}>;
const SidebarItem = ({ icon, title, href }: SidebarItemProps) => {
  const pathname = usePathname();
  const isActive = useMemo(() => {
    if (href === "/") return pathname === "/";
    else return pathname.includes(href);
  }, [pathname, href]);

  return (
    <div className="sidebar-item">
      <Link
        href={href}
        className={cn(
          "p-4 rounded-md block",
          isActive && "bg-primary-200 text-primary-800",
          !isActive && "hover:bg-primary-100"
        )}
      >
        <div className="flex gap-2">
          {icon}
          <span>{title}</span>
        </div>
      </Link>
    </div>
  );
};

export default SidebarItem;
