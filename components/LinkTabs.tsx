"use client";

import React from "react";
import Link from "next/link";
import { MoreVert } from "@mui/icons-material";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const isActivePath = (href?: string, pathname?: string, exact?: boolean) => {
  if (!href || !pathname) return false;
  if (href === pathname) return true;
  if (exact) return false;
  if (href === "/") return pathname === "/";

  const normalizedHref = href.endsWith("/") ? href.slice(0, -1) : href;
  const normalizedPathname = pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;

  return normalizedPathname.startsWith(`${normalizedHref}/`);
};

interface LinkTabProps {
  href?: string;
  children: React.ReactNode;
  disabled?: boolean;
  exact?: boolean;
}

export const LinkTab = ({ href, children, disabled, exact }: LinkTabProps) => {
  const pathname = usePathname();
  const active = isActivePath(href, pathname, exact);

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
  exact?: boolean;
}

interface LinkTabsProps {
  children: React.ReactNode;
}

const LinkTabs = ({ children }: LinkTabsProps) => {
  const pathname = usePathname();

  const tabItems: Tab[] = React.useMemo(() => {
    const childrenArray = React.Children.toArray(children);
    return childrenArray
      .map((child) => {
        if (
          React.isValidElement<LinkTabProps>(child) &&
          child.type === LinkTab
        ) {
          return {
            href: child.props.href || "",
            label: child.props.children,
            disabled: child.props.disabled,
            exact: child.props.exact,
          };
        }

        return { href: "", label: "" };
      })
      .filter((tab) => tab.href);
  }, [children]);

  if (tabItems.length === 0) {
    return null;
  }

  const activeTab =
    tabItems.find((tab) => isActivePath(tab.href, pathname, tab.exact)) ||
    tabItems[0];

  return (
    <div className="tabs flex flex-wrap gap-2 items-center">
      <div className="hidden sm:flex flex-wrap gap-2">
        {tabItems.map((tab) => (
          <LinkTab
            key={tab.href}
            href={tab.href}
            disabled={tab.disabled}
            exact={tab.exact}
          >
            {tab.label}
          </LinkTab>
        ))}
      </div>

      <div className="flex flex-wrap sm:hidden items-center gap-2 w-full">
        <LinkTab
          href={activeTab.href}
          disabled={activeTab.disabled}
          exact={activeTab.exact}
        >
          {activeTab.label}
        </LinkTab>
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
                <DropdownMenuItem
                  key={tab.href}
                  disabled={tab.disabled}
                  asChild={!tab.disabled}
                >
                  {tab.disabled ? (
                    <span>{tab.label}</span>
                  ) : (
                    <Link href={tab.href}>{tab.label}</Link>
                  )}
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default LinkTabs;
