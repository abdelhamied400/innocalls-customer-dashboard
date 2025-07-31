import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PropsWithChildren } from "react";

interface LinkTabProps {
  href?: string;
  active?: boolean;
  children: React.ReactNode;
}

export const LinkTab = ({ href, active, children }: LinkTabProps) => {
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

type LinkTabsProps = PropsWithChildren<{}>;

const LinkTabs = ({ children }: LinkTabsProps) => {
  return (
    <div className="tabs flex flex-wrap gap-2 items-center">{children}</div>
  );
};

export default LinkTabs;
