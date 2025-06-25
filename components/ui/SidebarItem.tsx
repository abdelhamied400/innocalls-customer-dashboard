"use client";
import { cn } from "@/lib/utils";
import { AutoAwesome, Timelapse } from "@mui/icons-material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren, ReactNode, useMemo } from "react";
import { Badge } from "./badge";

type SidebarItemProps = PropsWithChildren<{
  icon?: ReactNode;
  title?: string;
  href: string;
  disabled?: boolean;
  isNew?: boolean;
  isComingSoon?: boolean;
}>;
const SidebarItem = ({
  icon,
  title,
  href,
  disabled,
  isNew,
  isComingSoon,
}: SidebarItemProps) => {
  const pathname = usePathname();
  const isActive = useMemo(() => {
    if (href === "/") return pathname === "/";
    else return pathname.includes(href);
  }, [pathname, href]);

  return (
    <div className="sidebar-item">
      <Link
        href={disabled ? "#" : href}
        className={cn(
          "p-4 rounded-md block",
          isActive && "bg-primary-200 text-primary-800",
          !isActive && "hover:bg-primary-100 text-gray-600",
          disabled && "cursor-not-allowed text-gray-400 hover:bg-transparent"
        )}
      >
        <div className="flex gap-2">
          {icon}
          <span>{title}</span>
          {isNew && (
            <Badge
              className="ml-auto text-xs px-1 py-0.5 [&_svg]:size-4 flex items-center gap-1"
              variant="default"
            >
              <AutoAwesome className="text-sm" /> New
            </Badge>
          )}
          {isComingSoon && (
            <Badge
              className="ml-auto text-xs px-1 py-0.5 [&_svg]:size-4 flex items-center gap-1"
              variant="muted"
            >
              <Timelapse className="text-sm" /> Soon
            </Badge>
          )}
        </div>
      </Link>
    </div>
  );
};

export default SidebarItem;
