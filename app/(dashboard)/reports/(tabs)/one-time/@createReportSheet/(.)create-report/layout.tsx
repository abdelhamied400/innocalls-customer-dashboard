"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useRouter, usePathname } from "next/navigation";
import { PropsWithChildren, useEffect, useState } from "react";

type CreateReportLayoutProps = PropsWithChildren<object>;

const CreateReportLayout = ({ children }: CreateReportLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname.includes("create-report");
  const [isOpen, setIsOpen] = useState(isActive);

  useEffect(() => {
    if (isActive) {
      setIsOpen(true);
    }
  }, [isActive]);

  const handleOpenChange = (open: boolean) => {
    if (open) return;

    setIsOpen(false);
    router.replace("/reports/one-time");
  };

  if (!isActive) return null;

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent side="bottom" className="h-screen p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>Create New Report</SheetTitle>
          <SheetDescription>
            Create a new one-time report
          </SheetDescription>
        </SheetHeader>

        {children}
      </SheetContent>
    </Sheet>
  );
};

export default CreateReportLayout;
