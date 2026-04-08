"use client";
import { useState } from "react";
import { useTranslations } from "@/providers/TranslationProvider";
import { Button } from "@/components/ui/button";
import { Download } from "@mui/icons-material";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import callSurveyService from "@/services/call-survey.service";

type UncompletedHeadProps = {
  surveyId: string;
  surveyName?: string;
  totalItems: number;
};

const UncompletedHead = ({
  surveyId,
  surveyName,
  totalItems,
}: UncompletedHeadProps) => {
  const t = useTranslations("callSurvey.uncompleted");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await callSurveyService.exportUncompletedRequests(surveyId);
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
    <div className="table-head">
      <div className="flex justify-between items-center gap-4 p-3">
        <div className="flex items-center gap-3">
          <h3 className="m-0">{t("title")}</h3>
          {surveyName && (
            <p className="text-muted-foreground m-0 text-sm">({surveyName})</p>
          )}
          {totalItems > 0 && (
            <Badge variant="primary" className="text-sm">
              {totalItems}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3 actions">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={isExporting || totalItems === 0}
          >
            <Download sx={{ fontSize: 16 }} className="me-1" />
            {isExporting ? t("exporting") : t("export")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UncompletedHead;
