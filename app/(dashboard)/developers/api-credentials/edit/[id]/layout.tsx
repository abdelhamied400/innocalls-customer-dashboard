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

type EditApiCredentialLayoutProps = PropsWithChildren<object>;

const EditApiCredentialLayout = ({ children }: EditApiCredentialLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  const handleOpenChange = (open: boolean) => {
    if (open) return;
    setIsOpen(false);
    router.replace("/developers/api-credentials");
  };

  useEffect(() => {
    setIsOpen(pathname.includes("/edit/"));
  }, [pathname]);

  return (
    <div key={pathname}>
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetContent side="bottom" className="h-screen p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Edit API Credential</SheetTitle>
            <SheetDescription>
              Edit an existing API credential.
            </SheetDescription>
          </SheetHeader>
          {children}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default EditApiCredentialLayout;
