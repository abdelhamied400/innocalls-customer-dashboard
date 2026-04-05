"use client";
import withPermission from "@/containers/withPermission";
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
import { useTranslations } from "@/providers/TranslationProvider";
import callSurveyService from "@/services/call-survey.service";
import { useParams } from "next/navigation";
import { useLocalizedQuery } from "@/hooks/use-localized-query";

const answerTypeLabels: Record<string, string> = {
  one_five: "1 - 5",
  one_ten: "1 - 10",
  yes_no: "Yes / No",
};

const CallSurveyDetails = () => {
  const t = useTranslations("callSurvey.details");
  const { id } = useParams();
  const { data: survey, isLoading } = useLocalizedQuery({
    queryKey: ["call-survey-detail", id],
    queryFn: () => callSurveyService.getSurvey(id as string),
    gcTime: 0,
    refetchOnMount: "always",
  });

  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  if (!survey) {
    return <div>{t("notFound")}</div>;
  }

  return (
    <div className="call-survey-details flex flex-col gap-6">
      {/* Survey Details */}
      <div className="flex flex-col gap-2">
        <h3>{t("sections.basic")}</h3>
        <div className="border rounded-lg p-4 flex flex-col gap-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 divide-x">
            <Property label={t("fields.name")} value={survey.name} />
            <Property
              label={t("fields.trialsCount")}
              value={survey.trialsCount}
            />
            <Property
              label={t("fields.concurrencyCalls")}
              value={survey.concurrencyCalls}
            />
          </div>
          <hr />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 divide-x">
            <Property
              label={t("fields.delayMinutesBetweenTrials")}
              value={t("fields.minutesValue", {
                value: survey.delayMinutesBetweenTrials,
              })}
            />
            <Property
              label={t("fields.dtmfTimeout")}
              value={t("fields.secondsValue", {
                value: survey.dtmfTimeout,
              })}
            />
          </div>
        </div>
      </div>

      {/* Questions Details */}
      <div className="flex flex-col gap-2">
        <h3>{t("sections.questions")}</h3>
        <div className="border rounded-lg">
          <div className="p-4">
            <Property
              label={t("fields.maxQuestionAttempts")}
              value={survey.maxQuestionAttempts}
            />
          </div>
          {survey.questions.map((question, idx) => (
            <div key={question.id || idx}>
              <hr />
              <div className="p-4 flex flex-col lg:flex-row gap-4 divide-x">
                <div className="flex-1">
                  <Property
                    label={t("fields.answerType")}
                    value={answerTypeLabels[question.type] || question.type}
                  />
                </div>
                <div className="flex-1 ps-3">
                  <FileAttachment
                    fileName={question.soundFileName}
                    fileType={t("fileTypes.mp3")}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customers List */}
      <div className="border rounded-lg">
        <div className="p-4 bg-neutral-100 rounded-t-lg">
          <h3 className="m-0">{t("sections.customersList")}</h3>
        </div>
        <div className="p-4">
          <FileAttachment
            fileName={survey.fileName}
            fileType={t("fileTypes.mp3")}
          />
        </div>
      </div>

      {/* Sound Files */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="border rounded-lg">
          <div className="p-4 bg-neutral-100 rounded-t-lg">
            <h3 className="m-0">{t("fields.startSound")}</h3>
          </div>
          <div className="p-4">
            <FileAttachment
              fileName={survey.startSoundFileName}
              fileType={t("fileTypes.mp3")}
            />
          </div>
        </div>
        <div className="border rounded-lg">
          <div className="p-4 bg-neutral-100 rounded-t-lg">
            <h3 className="m-0">{t("fields.wrongEntrySound")}</h3>
          </div>
          <div className="p-4">
            <FileAttachment
              fileName={survey.wrongAnswerSoundFileName}
              fileType={t("fileTypes.mp3")}
            />
          </div>
        </div>
        <div className="border rounded-lg">
          <div className="p-4 bg-neutral-100 rounded-t-lg">
            <h3 className="m-0">{t("fields.endSound")}</h3>
          </div>
          <div className="p-4">
            <FileAttachment
              fileName={survey.endSoundFileName}
              fileType={t("fileTypes.mp3")}
            />
          </div>
        </div>
      </div>

      {/* Caller IDs + Time Slots */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Caller IDs */}
        <div className="border rounded-lg">
          <div className="p-4 bg-neutral-100 rounded-t-lg">
            <h3 className="m-0">{t("sections.callerIds")}</h3>
          </div>
          <div className="py-2">
            <Table>
              <TableHeader className="bg-neutral-100">
                <TableRow>
                  <TableHead>{t("fields.destination")}</TableHead>
                  <TableHead>{t("fields.callerNumber")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {survey.callers.map((caller, idx) => (
                  <TableRow key={idx} className="border-0 hover:bg-transparent">
                    <TableCell>{caller.destination}</TableCell>
                    <TableCell>{caller.callerNumber}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Time Slots */}
        <div className="border rounded-lg">
          <div className="p-4 bg-neutral-100 rounded-t-lg">
            <h3 className="m-0">{t("sections.timeSlots")}</h3>
          </div>
          <div className="py-2">
            <Table>
              <TableHeader className="bg-neutral-100">
                <TableRow>
                  <TableHead>{t("fields.timezone")}</TableHead>
                  <TableHead>{t("fields.from")}</TableHead>
                  <TableHead>{t("fields.to")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {survey.timeSlots.map((slot, idx) => (
                  <TableRow
                    key={slot.id || idx}
                    className="border-0 hover:bg-transparent"
                  >
                    <TableCell>{survey.timezone}</TableCell>
                    <TableCell>{slot.fromTime}</TableCell>
                    <TableCell>{slot.toTime}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withPermission(CallSurveyDetails, "fullAccessSurvey");
