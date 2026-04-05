"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Close } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "@/providers/TranslationProvider";

const CreateSurveySheet = () => {
  const t = useTranslations("callSurvey.create");
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    router.back();
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <SheetContent
        side="bottom"
        className="h-screen p-0"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>{t("title")}</SheetTitle>
          <SheetDescription>{t("description")}</SheetDescription>
        </SheetHeader>

        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">{t("title")}</h2>
            <Button size="icon" variant="unstyled" onClick={handleClose}>
              <Close className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          <div className="flex-1 mx-auto my-8 w-full max-w-[600px] max-h-[calc(100vh-200px)] overflow-auto px-4">
            {/* Create survey form will go here */}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CreateSurveySheet;
