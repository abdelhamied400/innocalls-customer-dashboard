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

type CreateBreakLayoutProps = PropsWithChildren<object>;

const CreateBreakLayout = ({ children }: CreateBreakLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  const handleOpenChange = (open: boolean) => {
    if (open) return;

    setIsOpen(false);
    router.replace("/settings/agent");
  };

  useEffect(() => {
    if (pathname.includes("create-break")) {
      setIsOpen(true);
    }
  }, [pathname]);

  return (
    <div className="create-break-layout" key={pathname}>
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetContent side="bottom" className="h-screen p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Create New Break</SheetTitle>
            <SheetDescription>Create a new break type</SheetDescription>
          </SheetHeader>

          {children}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CreateBreakLayout;
