"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useRouter, usePathname } from "next/navigation";
import { PropsWithChildren, useState, useEffect } from "react";

type CreateBreakLayoutProps = PropsWithChildren<object>;

const CreateBreakLayout = ({ children }: CreateBreakLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname.includes("create-break");
  const [isOpen, setIsOpen] = useState(isActive);

  useEffect(() => {
    if (isActive) {
      setIsOpen(true);
    }
  }, [isActive]);

  const handleOpenChange = (open: boolean) => {
    if (open) return;

    setIsOpen(false);
    router.replace("/settings/agent");
  };

  if (!isActive) return null;

  return (
    <div className="create-break-layout">
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
