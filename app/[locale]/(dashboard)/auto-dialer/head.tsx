"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AutoDialerHead = () => {
  const pathname = usePathname();

  return (
    <div className="flex items-center flex-wrap gap-2 auto-dialer-head">
      <Link
        href="/auto-dialer/active"
        className={cn(
          "bg-gray-200 px-4 py-2 rounded-full font-semibold",
          pathname === "/auto-dialer/active"
            ? "bg-primary-100 border border-primary text-primary"
            : ""
        )}
      >
        Active Campaign
      </Link>
      <Link
        href="/auto-dialer/finished"
        className={cn(
          "bg-gray-200 px-4 py-2 rounded-full font-semibold",
          pathname === "/auto-dialer/finished"
            ? "bg-primary-100 border border-primary text-primary"
            : ""
        )}
      >
        Finished Campaigns
      </Link>
      <Link
        href="/auto-dialer/Archived"
        className={cn(
          "bg-gray-200 px-4 py-2 rounded-full font-semibold",
          pathname === "/auto-dialer/Archived"
            ? "bg-primary-100 border border-primary text-primary"
            : ""
        )}
      >
        Archived Campaigns
      </Link>
    </div>
  );
};

export default AutoDialerHead;
