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

type EditWebCallLayoutProps = PropsWithChildren<object>;

const EditWebCallLayout = ({ children }: EditWebCallLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  const handleOpenChange = (open: boolean) => {
    if (open) return;
    setIsOpen(false);
    router.replace("/developers/webcall");
  };

  useEffect(() => {
    setIsOpen(pathname.includes("/edit/"));
  }, [pathname]);

  return (
    <div key={pathname}>
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetContent side="bottom" className="h-screen p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Edit Web Call App</SheetTitle>
            <SheetDescription>
              Edit an existing web call application.
            </SheetDescription>
          </SheetHeader>
          {children}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default EditWebCallLayout;
