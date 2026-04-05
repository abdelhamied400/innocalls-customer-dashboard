"use client";
import { CallSurveyCdr } from "@/types/callSurvey";
import { Cell } from "@/types/cell";
import { Button } from "@/components/ui/button";
import { PlayCircle, QuestionAnswer } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import StreamingSoundPlayer from "@/components/StreamingSoundPlayer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "@/providers/TranslationProvider";
import { Badge } from "@/components/ui/badge";

const questionTypes: Record<string, string> = {
  one_five: "1 - 5",
  one_ten: "1 - 10",
  zero_nine: "1 - 10",
  yes_no: "Yes / No",
};

type ActionsCellProps = Cell<CallSurveyCdr>;
const ActionsCell = ({ row }: ActionsCellProps) => {
  const t = useTranslations("callSurvey.cdrs");
  const cdr = row.original;

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        {/* Recording */}
        {cdr.recordingLink && (
          <Dialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button size="icon" variant="ghost-success">
                    <PlayCircle fontSize="small" />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>{t("actions.listen")}</TooltipContent>
            </Tooltip>
            <DialogContent>
              <DialogTitle>{cdr.phone}</DialogTitle>
              <StreamingSoundPlayer label={cdr.name} url={cdr.recordingLink} />
            </DialogContent>
          </Dialog>
        )}

        {/* Answers */}
        {cdr.completionStatus !== "no-response" && cdr.answers.length > 0 && (
          <Dialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button size="icon" variant="ghost-primary">
                    <QuestionAnswer fontSize="small" />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>{t("actions.answers")}</TooltipContent>
            </Tooltip>
            <DialogContent className="max-h-[80vh] overflow-auto">
              <DialogTitle>{t("answersModal.title")}</DialogTitle>
              <div className="flex flex-col gap-4">
                {cdr.answers.map((answer, idx) => (
                  <div
                    key={idx}
                    className="border rounded-lg p-4 flex flex-col gap-2"
                  >
                    <h4 className="font-semibold m-0">
                      {t("answersModal.question")} {answer.questionIndex + 1}
                    </h4>
                    <p className="text-sm m-0">
                      <span className="font-bold">
                        {t("answersModal.attemptNumber")}:
                      </span>{" "}
                      {answer.attemptNumber}
                    </p>
                    <p className="text-sm m-0">
                      <span className="font-bold">
                        {t("answersModal.questionType")}:
                      </span>{" "}
                      {questionTypes[answer.questionType] || answer.questionType}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">
                        {t("answersModal.userResponse")}:
                      </span>
                      {answer.questionType === "yes_no" ? (
                        <Badge
                          variant={
                            answer.userResponse === 1
                              ? "success"
                              : "destructive"
                          }
                        >
                          {answer.userResponse === 1 ? "Yes" : "No"}
                        </Badge>
                      ) : (
                        <Badge variant="warning">{answer.userResponse}</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </TooltipProvider>
  );
};

export default ActionsCell;
