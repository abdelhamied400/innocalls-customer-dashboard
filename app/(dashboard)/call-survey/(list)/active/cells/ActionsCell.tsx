"use client";
import { CallSurvey } from "@/types/callSurvey";
import { Cell } from "@/types/cell";
import { Button } from "@/components/ui/button";
import {
  Visibility,
  MoreVert,
  PersonAdd,
  Warning,
  List,
  AssignmentLate,
  BarChart,
} from "@mui/icons-material";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "@/providers/TranslationProvider";
import SurveyActions from "@/app/(dashboard)/call-survey/[id]/details/SurveyActions";

type ActionsCellProps = Cell<CallSurvey>;
const ActionsCell = ({ row }: ActionsCellProps) => {
  const t = useTranslations("callSurvey.active");
  const survey = row.original;

  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-2">
        <SurveyActions
          surveyId={survey.id}
          status={survey.status}
          isDraft={survey.isDraft}
        />

        {/* View details — always */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost-primary" size="icon" asChild>
              <Link href={`/call-survey/${survey.id}`}>
                <Visibility fontSize="small" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("actions.view")}</TooltipContent>
        </Tooltip>

        {/* Dropdown — extra actions */}
        {[
          "created",
          "verification-failed",
          "paused",
          "active",
          "in-progress",
        ].includes(survey.status) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="unstyled" size="icon">
                <MoreVert fontSize="small" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {survey.status === "created" && (
                <Link href={`/call-survey/${survey.id}/attach-customers`}>
                  <DropdownMenuItem>
                    <PersonAdd fontSize="small" />
                    {t("actions.addCustomers")}
                  </DropdownMenuItem>
                </Link>
              )}
              {survey.status === "verification-failed" && (
                <Link href={`/call-survey/${survey.id}/corrupted-rows`}>
                  <DropdownMenuItem>
                    <Warning fontSize="small" />
                    {t("actions.corruptedRows")}
                  </DropdownMenuItem>
                </Link>
              )}
              {["paused", "active", "in-progress"].includes(survey.status) && (
                <Link href={`/call-survey/${survey.id}/details/cdrs`}>
                  <DropdownMenuItem>
                    <List fontSize="small" />
                    {t("actions.cdrs")}
                  </DropdownMenuItem>
                </Link>
              )}
              {["paused", "active", "in-progress"].includes(survey.status) && (
                <Link href={`/call-survey/${survey.id}/uncompleted`}>
                  <DropdownMenuItem>
                    <AssignmentLate fontSize="small" />
                    {t("actions.uncompleted")}
                  </DropdownMenuItem>
                </Link>
              )}
              {["active", "in-progress", "paused"].includes(survey.status) && (
                <Link href={`/call-survey/${survey.id}/details/metrics`}>
                  <DropdownMenuItem>
                    <BarChart fontSize="small" />
                    {t("actions.metrics")}
                  </DropdownMenuItem>
                </Link>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </TooltipProvider>
  );
};

export default ActionsCell;
