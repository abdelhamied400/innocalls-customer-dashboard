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

type CreateUserLayoutProps = PropsWithChildren<{}>;
const CreateUserLayout = ({ children }: CreateUserLayoutProps) => {
  const router = useRouter();
  return (
    <div className="create-user-loading">
      <Sheet defaultOpen onOpenChange={() => router.back()}>
        <SheetContent side="bottom" className="h-screen p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Create new user</SheetTitle>
            <SheetDescription>
              Create a new user by filling out the form below.
            </SheetDescription>
          </SheetHeader>

          {children}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CreateUserLayout;
