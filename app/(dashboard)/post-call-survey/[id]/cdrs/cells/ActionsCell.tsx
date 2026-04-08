"use client";

import { PostCallSurveyCdr } from "@/types/api/post-call-survey";
import { Cell } from "@/types/cell";
import { Button } from "@/components/ui/button";
import { InsertComment } from "@mui/icons-material";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "@/providers/TranslationProvider";
import { QUESTION_TYPES } from "@/constants/call-survey";

type ActionsCellProps = Cell<PostCallSurveyCdr>;
const ActionsCell = ({ row }: ActionsCellProps) => {
  const t = useTranslations("postCallSurvey.cdrs");
  const cdr = row.original;

  if (cdr.completionStatus === "no-response" || cdr.answers.length === 0) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Sheet>
          <Tooltip>
            <TooltipTrigger asChild>
              <SheetTrigger asChild>
                <Button size="icon" variant="ghost-success">
                  <InsertComment className="-scale-x-100" fontSize="small" />
                </Button>
              </SheetTrigger>
            </TooltipTrigger>
            <TooltipContent>{t("actions.answers")}</TooltipContent>
          </Tooltip>
          <SheetContent className="p-0 flex flex-col sm:max-w-150">
            <SheetHeader className="flex flex-row items-center justify-between p-4 border-b">
              <SheetTitle>{t("answersModal.title")}</SheetTitle>
              <SheetClose className="rounded-sm opacity-70 hover:opacity-100" />
            </SheetHeader>
            <div className="flex flex-col gap-4 p-4 overflow-auto">
              {cdr.answers.map((answer, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-2 border rounded-lg bg-white"
                >
                  <div className="p-4 bg-neutral-100 rounded-t-lg">
                    <h4 className="font-semibold m-0">
                      {t("answersModal.question")} {answer.questionIndex + 1}
                    </h4>
                  </div>
                  <div className="p-4 flex flex-col lg:flex-row gap-4 divide-x">
                    <div className="flex-1 ps-3">
                      <p className="text-muted-foreground">
                        {t("answersModal.userResponse")}
                      </p>
                      <p className="font-bold">{answer.userResponse}</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-muted-foreground">
                        {t("answersModal.attemptNumber")}
                      </p>
                      <p className="font-bold">{answer.attemptNumber}</p>
                    </div>
                    <div className="flex-1 ps-3">
                      <p className="text-muted-foreground">
                        {t("answersModal.questionType")}
                      </p>
                      <p className="font-bold">
                        {QUESTION_TYPES[answer.questionType] ||
                          answer.questionType}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </TooltipProvider>
  );
};

export default ActionsCell;
