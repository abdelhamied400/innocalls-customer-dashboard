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
  children: React.ReactNode;
}

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVert } from "@mui/icons-material";
import React from "react";

const LinkTabs = ({ children }: LinkTabsProps) => {
  const pathname = usePathname();

  // Extract tab data from LinkTab children
  const tabItems: Tab[] = React.useMemo(() => {
    const childrenArray = React.Children.toArray(children);
    return childrenArray
      .map((child) => {
        if (
          React.isValidElement<LinkTabProps>(child) &&
          child.type === LinkTab
        ) {
          const href = child.props.href || "";
          const label = child.props.children;
          return { href, label };
        }
        return { href: "", label: "" };
      })
      .filter((tab) => tab.href); // Filter out invalid tabs
  }, [children]);

  if (tabItems.length === 0) {
    return null;
  }

  const activeTab =
    tabItems.find((tab) => tab.href === pathname) || tabItems[0];

  // Responsive: show all tabs on desktop, selected tab + dropdown on mobile
  return (
    <div className="tabs flex flex-wrap gap-2 items-center">
      {/* Desktop */}
      <div className="hidden sm:flex flex-wrap gap-2">
        {tabItems.map((tab) => (
          <LinkTab key={tab.href} href={tab.href}>
            {tab.label}
          </LinkTab>
        ))}
      </div>
      {/* Mobile */}
      <div className="flex flex-wrap sm:hidden items-center gap-2 w-full">
        <LinkTab href={activeTab.href}>{activeTab.label}</LinkTab>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="tab" size="icon">
              <MoreVert />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {tabItems
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
