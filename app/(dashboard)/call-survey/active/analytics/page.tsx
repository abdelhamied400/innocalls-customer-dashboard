"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Download, Close } from "@mui/icons-material";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import callSurveyService from "@/services/call-survey.service";
import { useTranslations } from "@/providers/TranslationProvider";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import Property from "@/components/Property";

const SurveyAnalyticsSheet = () => {
  const t = useTranslations("callSurvey.analytics");
  const router = useRouter();
  const searchParams = useSearchParams();
  const surveyId = searchParams.get("id");
  const [isOpen, setIsOpen] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const { data: analysis, isLoading } = useLocalizedQuery({
    queryKey: ["call-survey-analysis", surveyId],
    queryFn: () => callSurveyService.getAnalysis(surveyId as string),
    enabled: !!surveyId,
    gcTime: 0,
  });

  const handleClose = () => {
    setIsOpen(false);
    router.back();
  };

  const handleExport = async () => {
    if (!surveyId) return;
    try {
      setIsExporting(true);
      await callSurveyService.exportStats(surveyId);
      toast.success(t("exportSuccess"), {
        description: t("exportSuccessDescription"),
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(t("exportError"), {
          description:
            error.response?.data?.message || t("exportErrorDescription"),
        });
        return;
      }
      toast.error(t("exportError"), {
        description: t("exportErrorDescription"),
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <SheetContent side="bottom" className="h-screen p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>{t("title")}</SheetTitle>
          <SheetDescription>{t("description")}</SheetDescription>
        </SheetHeader>

        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">{t("title")}</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={isExporting}
              >
                <Download sx={{ fontSize: 16 }} className="me-1" />
                {isExporting ? t("exporting") : t("export")}
              </Button>
              <Button size="icon" variant="unstyled" onClick={handleClose}>
                <Close className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 mx-auto my-8 w-full max-w-[800px] max-h-[calc(100vh-200px)] overflow-auto px-4">
            {isLoading && (
              <div className="flex flex-col gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            )}

            {!isLoading && !analysis && (
              <div className="text-center text-muted-foreground py-8">
                {t("noData")}
              </div>
            )}

            {!isLoading && analysis && (
              <div className="flex flex-col gap-6">
                {/* Summary */}
                {analysis.summary && (
                  <div className="flex flex-col gap-2">
                    <h3>{t("sections.summary")}</h3>
                    <div className="border rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 divide-x">
                      {Object.entries(analysis.summary).map(([key, value]) => (
                        <Property
                          key={key}
                          label={t(`fields.${key}` as any) || key}
                          value={value as string | number}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Questions Analysis */}
                {analysis.questions &&
                  Array.isArray(analysis.questions) &&
                  analysis.questions.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <h3>{t("sections.questions")}</h3>
                      <div className="flex flex-col gap-4">
                        {analysis.questions.map(
                          (question: any, idx: number) => (
                            <div
                              key={idx}
                              className="border rounded-lg p-4 flex flex-col gap-3"
                            >
                              <h4 className="font-semibold">
                                {t("questionLabel", { number: idx + 1 })}
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Object.entries(question).map(
                                  ([key, value]) => (
                                    <Property
                                      key={key}
                                      label={
                                        t(`fields.${key}` as any) || key
                                      }
                                      value={value as string | number}
                                    />
                                  ),
                                )}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                {/* Raw data fallback — render all top-level keys not yet handled */}
                {!analysis.summary && !analysis.questions && (
                  <div className="flex flex-col gap-2">
                    <h3>{t("sections.overview")}</h3>
                    <div className="border rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(analysis).map(([key, value]) => {
                        if (
                          typeof value === "string" ||
                          typeof value === "number"
                        ) {
                          return (
                            <Property
                              key={key}
                              label={t(`fields.${key}` as any) || key}
                              value={value}
                            />
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SurveyAnalyticsSheet;
