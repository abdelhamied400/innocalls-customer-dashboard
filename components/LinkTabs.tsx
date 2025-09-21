"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface LinkTabProps {
  href?: string;
  children: React.ReactNode;
}

export const LinkTab = ({ href, children }: LinkTabProps) => {
  const pathname = usePathname();
  const active = href ? href === pathname : false;

  if (href) {
    return (
      <Link href={href}>
        <Button variant="tab" data-active={active ? true : undefined}>
          {children}
        </Button>
      </Link>
    );
  }
  return (
    <Button variant="tab" data-active={active ? true : undefined}>
      {children}
    </Button>
  );
};

interface Tab {
  label: React.ReactNode;
  href: string;
}

interface LinkTabsProps {
  tabs: Tab[];
}

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVert } from "@mui/icons-material";

const LinkTabs = ({ tabs }: LinkTabsProps) => {
  const pathname = usePathname();
  const activeTab = tabs.find((tab) => tab.href === pathname) || tabs[0];

  // Responsive: show all tabs on desktop, selected tab + dropdown on mobile
  return (
    <div className="tabs flex flex-wrap gap-2 items-center">
      {/* Desktop */}
      <div className="hidden sm:flex gap-2">
        {tabs.map((tab) => (
          <LinkTab key={tab.href} href={tab.href}>
            {tab.label}
          </LinkTab>
        ))}
      </div>
      {/* Mobile */}
      <div className="flex sm:hidden items-center gap-2 w-full">
        <LinkTab href={activeTab.href}>{activeTab.label}</LinkTab>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="tab" size="icon">
              <MoreVert />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {tabs
              .filter((tab) => tab.href !== activeTab.href)
              .map((tab) => (
                <DropdownMenuItem key={tab.href} asChild>
                  <Link href={tab.href}>{tab.label}</Link>
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default LinkTabs;
