import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PropsWithChildren } from "react";
import { usePathname } from "@/i18n/routing";
import { useSession } from "next-auth/react";

interface LinkTabProps {
  href?: string;
  children: React.ReactNode;
}

export const LinkTab = ({ href, children }: LinkTabProps) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userType = session?.user?.userType || "guest";
  const active = href ? `/${userType}${href}` === pathname : false;

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
