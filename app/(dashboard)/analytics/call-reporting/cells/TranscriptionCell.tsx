"use client";

import { Call } from "@/types/api/call-reporting";
import { Cell } from "@/types/cell";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  SentimentVerySatisfied,
  SentimentVeryDissatisfied,
  SentimentNeutral,
  SentimentSatisfied,
  HourglassBottom,
} from "@mui/icons-material";
import { useTranslations } from "@/providers/TranslationProvider";

const sentimentConfig = {
  positive: {
    icon: SentimentVerySatisfied,
    className: "text-green-500",
    badgeVariant: "success" as const,
  },
  negative: {
    icon: SentimentVeryDissatisfied,
    className: "text-red-500",
    badgeVariant: "destructive" as const,
  },
  neutral: {
    icon: SentimentNeutral,
    className: "text-gray-500",
    badgeVariant: "muted" as const,
  },
  mixed: {
    icon: SentimentSatisfied,
    className: "text-yellow-500",
    badgeVariant: "warning" as const,
  },
} as const;

const TranscriptionCell = ({ row }: Cell<Call>) => {
  const transcription = row.original.transcription;
  const t = useTranslations("callReporting.transcription");

  if (!transcription) return null;

  if (transcription.status === "pending" || transcription.status === "processing") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex items-center justify-center h-9 w-9 cursor-default">
              <HourglassBottom className="text-gray-400 animate-pulse" />
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <span className="text-xs">{t("processing")}</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  const sentiment = transcription.sentiment;
  const config =
    sentimentConfig[sentiment?.overall ?? "neutral"] ?? sentimentConfig.neutral;
  const Icon = config.icon;

  return (
    <Sheet>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <SheetTrigger asChild>
              <Button variant="ghost-primary" size="icon">
                <Icon className={config.className} />
              </Button>
            </SheetTrigger>
          </TooltipTrigger>
          {sentiment && (
            <TooltipContent>
              <div className="flex flex-col gap-1 text-xs">
                <span>
                  {t("sentiment.overall")}: {t(`sentiment.${sentiment.overall}`)}
                </span>
                <span>
                  {t("sentiment.score")}: {`${Math.round(sentiment.score * 100)}\u200E%`}
                </span>
              </div>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      <SheetContent className="p-0 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between border-b p-4">
            <span>{t("title")}</span>
            <SheetClose />
          </SheetTitle>
        </SheetHeader>

        <div className="p-4 flex flex-col gap-4">
          {sentiment && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <label className="text-sm text-gray-600 font-semibold">
                {t("sentiment.title")}
              </label>
              <div className="flex items-center gap-2 mt-2">
                <Icon className={config.className} />
                <Badge variant={config.badgeVariant}>
                  {t(`sentiment.${sentiment.overall}`)}
                </Badge>
                <span className="text-sm text-gray-500">
                  {`${Math.round(sentiment.score * 100)}\u200E%`}
                </span>
              </div>
              <div className="flex gap-3 mt-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500">{t("sentiment.customer")}</span>
                  <Badge
                    variant={
                      (sentimentConfig[sentiment.customer_sentiment as keyof typeof sentimentConfig]
                        ?? sentimentConfig.neutral).badgeVariant
                    }
                    className="text-xs px-2 py-0.5"
                  >
                    {t(`sentiment.${sentiment.customer_sentiment}`)}
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500">{t("sentiment.agent")}</span>
                  <Badge
                    variant={
                      (sentimentConfig[sentiment.agent_sentiment as keyof typeof sentimentConfig]
                        ?? sentimentConfig.neutral).badgeVariant
                    }
                    className="text-xs px-2 py-0.5"
                  >
                    {t(`sentiment.${sentiment.agent_sentiment}`)}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {transcription.summary && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <label className="text-sm text-gray-600 font-semibold">
                {t("summary")}
              </label>
              <p dir="auto" className="text-sm text-gray-700 mt-2 leading-relaxed">
                {transcription.summary}
              </p>
            </div>
          )}

          {transcription.topics && transcription.topics.length > 0 && (
            <div>
              <label className="text-sm text-gray-600 font-semibold">
                {t("topics")}
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                {transcription.topics.map((topic) => (
                  <Badge key={topic} variant="default">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {transcription.actionItems && transcription.actionItems.length > 0 && (
            <div>
              <label className="text-sm text-gray-600 font-semibold">
                {t("actionItems")}
              </label>
              <ul className="mt-2 space-y-2">
                {transcription.actionItems.map((item, index) => (
                  <li
                    key={index}
                    dir="auto"
                    className="flex items-start gap-2 text-sm text-gray-700"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {transcription.agentQualityScore && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <label className="text-sm text-gray-600 font-semibold">
                {t("qualityScore.title")}
              </label>

              {transcription.agentQualityScore.score != null && (
                <div dir="ltr" className="flex items-center gap-3 mt-3 w-fit">
                  <span className="text-3xl font-bold text-gray-800">
                    {transcription.agentQualityScore.score}
                  </span>
                  <span className="text-sm text-gray-500">/ 10</span>
                </div>
              )}

              <div className="mt-3 space-y-2.5">
                {(
                  [
                    ["greeting", "greeting"],
                    ["closing", "closing"],
                    ["professionalism", "professionalism"],
                    ["product_knowledge", "productKnowledge"],
                    ["objection_handling", "objectionHandling"],
                  ] as const
                ).map(([key, translationKey]) => {
                  const value =
                    transcription.agentQualityScore?.[key];
                  if (value == null) return null;
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>{t(`qualityScore.${translationKey}`)}</span>
                        <span>{value}/10</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            value >= 7
                              ? "bg-green-500"
                              : value >= 4
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${(value / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {transcription.agentQualityScore.notes && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <span className="text-xs text-gray-500 font-semibold">
                    {t("qualityScore.notes")}
                  </span>
                  <p dir="auto" className="text-sm text-gray-700 mt-1 leading-relaxed">
                    {transcription.agentQualityScore.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TranscriptionCell;
