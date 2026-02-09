"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface LinkTabProps {
  href?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export const LinkTab = ({ href, children, disabled }: LinkTabProps) => {
  const pathname = usePathname();
  const active = href ? href === pathname : false;

  if (href && !disabled) {
    return (
      <Link href={href}>
        <Button
          className="h-auto whitespace-normal"
          variant="tab"
          data-active={active ? true : undefined}
        >
          {children}
        </Button>
      </Link>
    );
  }
  return (
    <Button
      className="h-auto whitespace-normal"
      variant="tab"
      data-active={active ? true : undefined}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};

interface Tab {
  label: React.ReactNode;
  href: string;
  disabled?: boolean;
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
          const disabled = child.props.disabled;
          return { href, label, disabled };
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
          <LinkTab key={tab.href} href={tab.href} disabled={tab.disabled}>
            {tab.label}
          </LinkTab>
        ))}
      </div>
      {/* Mobile */}
      <div className="flex flex-wrap sm:hidden items-center gap-2 w-full">
        <LinkTab href={activeTab.href} disabled={activeTab.disabled}>{activeTab.label}</LinkTab>
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
                <DropdownMenuItem key={tab.href} disabled={tab.disabled} asChild={!tab.disabled}>
                  {tab.disabled ? <span>{tab.label}</span> : <Link href={tab.href}>{tab.label}</Link>}
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default LinkTabs;
