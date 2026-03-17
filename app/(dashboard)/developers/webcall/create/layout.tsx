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

type CreateWebCallLayoutProps = PropsWithChildren<object>;

const CreateWebCallLayout = ({ children }: CreateWebCallLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  const handleOpenChange = (open: boolean) => {
    if (open) return;
    setIsOpen(false);
    router.replace("/developers/webcall");
  };

  useEffect(() => {
    setIsOpen(pathname.includes("/create"));
  }, [pathname]);

  return (
    <div key={pathname}>
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetContent side="bottom" className="h-screen p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Create Web Call App</SheetTitle>
            <SheetDescription>
              Create a new web call application.
            </SheetDescription>
          </SheetHeader>
          {children}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CreateWebCallLayout;
