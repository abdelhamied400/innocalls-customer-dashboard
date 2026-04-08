"use client";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslations } from "@/providers/TranslationProvider";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Dropzone, {
  DropzoneFileList,
  DropzoneTrigger,
} from "@/components/ui/dropzone";
import type { CreateSurveyForm } from "@/validation/CallSurveyCreate";
import { Download, Save } from "@mui/icons-material";
import callSurveyService from "@/services/call-survey.service";

type CustomersListStepProps = {
  onSave: (isDraft: boolean) => Promise<void>;
};

const CustomersListStep = ({ onSave }: CustomersListStepProps) => {
  const t = useTranslations("callSurvey.create.form");
  const tActions = useTranslations("callSurvey.create.actions");
  const form = useFormContext<CreateSurveyForm>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    setValue,
    formState: { errors },
  } = form;

  const handleDownloadTemplate = async () => {
    const blob = await callSurveyService.downloadCustomersTemplate();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "call-survey-template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSave = async (isDraft: boolean) => {
    try {
      setIsSubmitting(true);
      await onSave(isDraft);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <div className="flex flex-col gap-4">
        <Dropzone
          options={{
            accept: { "text/csv": [".csv"] },
            multiple: false,
            maxFiles: 1,
          }}
          value={form.watch("customersFile")}
          onChange={(file) => {
            setValue("customersFile", file, { shouldValidate: true });
          }}
        >
          <DropzoneTrigger />
          <DropzoneFileList />
        </Dropzone>
        {errors.customersFile?.message && (
          <p className="text-destructive text-sm">
            {errors.customersFile.message as string}
          </p>
        )}

        <div className="">
          <Button
            type="button"
            variant="link"
            onClick={handleDownloadTemplate}
          >
            <Download className="me-2" />
            <span>{t("customersFile.downloadTemplate")}</span>
          </Button>
        </div>

        <ul className="text-sm text-muted-foreground list-disc ps-5 space-y-1">
          <li>{t("customersFile.rules.countryCode")}</li>
          <li>{t("customersFile.rules.noPrefix")}</li>
          <li>{t("customersFile.rules.numberFormat")}</li>
        </ul>

        <TooltipProvider>
          <div className="flex items-center gap-3 justify-end">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleSave(true)}
                  disabled={isSubmitting}
                >
                  <Save />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{tActions("saveAsDraft")}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="flex-1"
                  type="button"
                  size="lg"
                  onClick={() => handleSave(false)}
                  disabled={isSubmitting}
                >
                  {tActions("saveAndRun")}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{tActions("saveAndRun")}</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
    </Form>
  );
};

export default CustomersListStep;
