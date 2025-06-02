"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import { PropsWithChildren } from "react";

type EditUserLayoutProps = PropsWithChildren<{}>;
const EditUserLayout = ({ children }: EditUserLayoutProps) => {
  const router = useRouter();
  return (
    <div className="edit-user-loading">
      <Sheet defaultOpen onOpenChange={() => router.back()}>
        <SheetContent side="bottom" className="h-screen p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Edit new user</SheetTitle>
            <SheetDescription>
              Edit a new user by filling out the form below.
            </SheetDescription>
          </SheetHeader>

          {children}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default EditUserLayout;
