"use client";

import withActiveOrganization from "@/containers/withActiveOrganization";
import FileAttachment from "@/components/FileAttachment";
import Property from "@/components/Property";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "@/providers/TranslationProvider";
import postCallSurveyService from "@/services/post-call-survey.service";
import { useParams } from "next/navigation";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { Skeleton } from "@/components/ui/skeleton";

const answerTypeLabels: Record<string, string> = {
  one_five: "1 - 5",
  one_ten: "1 - 10",
  yes_no: "Yes / No",
};

const PostCallSurveyDetails = () => {
  const t = useTranslations("postCallSurvey.details");
  const { id } = useParams();

  const { data: survey, isLoading } = useLocalizedQuery({
    queryKey: ["post-call-survey-detail", id],
    queryFn: () => postCallSurveyService.fetchById(id as string),
    gcTime: 0,
    refetchOnMount: "always",
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <Skeleton className="h-8 w-64" />
        <div className="border rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!survey) {
    return <div>{t("notFound")}</div>;
  }

  return (
    <div className="post-call-survey-details flex flex-col gap-4 bg-white p-4 rounded-lg">
      <div className="basic-details flex flex-col gap-2">
        <h3>{t("sections.basic")}</h3>
        <div className="border rounded-lg p-4 flex flex-col gap-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 divide-x">
            <Property label={t("fields.name")} value={survey.name} />
            <Property
              label={t("fields.dtmfTimeout")}
              value={t("fields.secondsValue", { value: survey.dtmfTimeout })}
            />
            <Property
              label={t("fields.maxQuestionAttempts")}
              value={survey.maxQuestionAttempts}
            />
          </div>
          <hr />
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
            <div className="property">
              <p className="text-sm text-muted-foreground">{t("fields.allowDTMFInputDuringPlayback")}</p>
              <Badge variant={survey.allowDTMFInputDuringPlayback ? "success" : "muted"}>
                {survey.allowDTMFInputDuringPlayback ? t("fields.yes") : t("fields.no")}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="sound-files flex flex-col gap-2 border rounded-lg">
        <div className="header p-4 bg-neutral-100 rounded-t-lg">
          <h3>{t("sections.sounds")}</h3>
        </div>
        <div className="p-4 flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row gap-4 divide-x">
            <div className="flex-1 pe-3">
              <FileAttachment
                label={t("fields.startSound")}
                fileName={survey.startSoundFileName}
                fileType="mp3"
              />
            </div>
            <div className="flex-1 ps-3">
              <FileAttachment
                label={t("fields.endSound")}
                fileName={survey.endSoundFileName}
                fileType="mp3"
              />
            </div>
          </div>
          <hr />
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <FileAttachment
                label={t("fields.wrongAnswerSound")}
                fileName={survey.wrongAnswerSoundFileName}
                fileType="mp3"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="questions-list flex flex-col gap-2 border rounded-lg">
        <div className="header p-4 bg-neutral-100 rounded-t-lg">
          <h3>{t("sections.questions")}</h3>
        </div>
        <Table>
          <TableHeader className="bg-neutral-100">
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>{t("fields.questionSound")}</TableHead>
              <TableHead>{t("fields.answerType")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {survey.questions.map((question, index) => (
              <TableRow key={index} className="border-0 hover:bg-transparent">
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <FileAttachment
                    fileName={question.soundFileName}
                    fileType="mp3"
                  />
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {answerTypeLabels[question.type] || question.type}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default withActiveOrganization(PostCallSurveyDetails);
