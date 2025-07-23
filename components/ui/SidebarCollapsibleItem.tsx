"use client";
import { cn } from "@/lib/utils";
import { AutoAwesome, Timelapse } from "@mui/icons-material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { Badge } from "./badge";
import { useTranslations } from "next-intl";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";
import { useSession } from "next-auth/react";
import { ChevronDown } from "lucide-react";

type SidebarCollapsibleItemProps = {
  icon?: ReactNode;
  title?: string;
  children: ReactNode;
  isNew?: boolean;
  href: string;
  isComingSoon?: boolean;
};

const SidebarCollapsibleItem = ({
  icon,
  title,
  children,
  href,
  isNew,
  isComingSoon,
}: SidebarCollapsibleItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("components.sidebarItem");
  const pathname = usePathname();
  const { data: session } = useSession();

  const role = session?.user?.role;

  const isActive = useMemo(() => {
    if (href === `/${role}`) return pathname === `/${role}`;
    else return pathname.includes(href);
    //
  }, [pathname, href, role]);

  useEffect(() => {
    // Automatically open the collapsible if the current path matches the href
    if (isActive) {
      setIsOpen(true);
    }
  }, [isActive]);

  return (
    <div className="sidebar-item">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <button
            className={cn(
              "p-4 rounded-md block w-full text-left",
              "hover:bg-primary-100 text-gray-600",
              isActive && "bg-primary-200 text-primary-800",
              !isActive && "hover:bg-primary-100 text-gray-600"
            )}
          >
            <div className="flex gap-2 items-center justify-between w-full">
              <div className="flex gap-2 items-center">
                {icon}
                <span>{title}</span>
              </div>
              <div className="flex items-center gap-2">
                {isNew && (
                  <Badge
                    className="text-xs px-1 py-0.5 [&_svg]:size-4 flex items-center gap-1"
                    variant="default"
                  >
                    <AutoAwesome className="text-sm" /> {t("new")}
                  </Badge>
                )}
                {isComingSoon && (
                  <Badge
                    className="text-xs px-1 py-0.5 [&_svg]:size-4 flex items-center gap-1"
                    variant="muted"
                  >
                    <Timelapse className="text-sm" /> {t("soon")}
                  </Badge>
                )}
                <ChevronDown
                  className={cn(
                    "transition-transform",
                    isOpen ? "rotate-180" : "rotate-0"
                  )}
                />
              </div>
            </div>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="pt-2 pl-4 border-s border-dashed">{children}</div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default SidebarCollapsibleItem;
