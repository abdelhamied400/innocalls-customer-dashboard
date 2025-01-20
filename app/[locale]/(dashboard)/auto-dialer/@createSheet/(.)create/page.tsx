"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ChevronLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";

const Create = () => {
  const router = useRouter();
  return (
    <Sheet defaultOpen={true} onOpenChange={() => router.back()}>
      <SheetContent side="bottom" className="h-screen p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>Create Auto Dialer Campaign</SheetTitle>
          <SheetDescription>
            Create a new auto dialer campaign to start calling your leads.
          </SheetDescription>
        </SheetHeader>
        <div className="head bg-white px-12 py-4 flex justify-between gap-2 items-center">
          <Button variant="unstyled" size="icon">
            <ChevronLeft />
          </Button>
          <h2 className="text-xl font-semibold">Create</h2>
          <SheetClose>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Create;
