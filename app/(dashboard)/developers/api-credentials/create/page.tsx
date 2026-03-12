"use client";

import { useTranslations } from "@/providers/TranslationProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import apiCredentialService from "@/services/api-credential.service";
import { CreateApiCredentialResponse } from "@/types/api/api-credential";
import {
  CreateApiCredentialSchema,
  CreateApiCredentialFormValues,
  API_CREDENTIAL_SERVICES,
} from "@/validation/ApiCredential";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import withActiveOrganization from "@/containers/withActiveOrganization";
import withPermission from "@/containers/withPermission";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SheetClose } from "@/components/ui/sheet";
import Select, { Option } from "@/components/Select";
import Stepper, {
  StepperHeader,
  StepperHeaderTitle,
  StepperPrevious,
  StepperStep,
  StepperSteps,
} from "@/components/ui/stepper";
import { ChevronLeftIcon, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, ContentCopy, Download } from "@mui/icons-material";

const CreateApiCredentialPage = () => {
  const t = useTranslations("developers.apiCredentials");
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] =
    useState<CreateApiCredentialResponse | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const serviceOptions: Option[] = API_CREDENTIAL_SERVICES.map((s) => ({
    label: t(`serviceLabels.${s}`),
    value: s,
  }));

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateApiCredentialFormValues>({
    resolver: zodResolver(CreateApiCredentialSchema(t)),
    defaultValues: { title: "", services: [] },
  });

  const handleFormSubmit = async (data: CreateApiCredentialFormValues) => {
    try {
      setIsSubmitting(true);
      const result = await apiCredentialService.create(data);
      await queryClient.invalidateQueries({ queryKey: ["api-credentials"] });
      toast.success(t("messages.createSuccess"));
      setGeneratedCredentials(result);
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(t("messages.createFailed"), {
          description: error.response?.data?.message,
        });
      } else {
        toast.error(t("messages.createFailed"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = async (value: string, field: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedField(field);
    toast.success(t("messages.copiedToClipboard"));
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDownload = () => {
    if (!generatedCredentials) return;
    const content = `API ID: ${generatedCredentials.apiId}\nAPI Secret: ${generatedCredentials.apiSecret}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "api-credentials.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(t("messages.downloaded"));
  };

  return (
    <Stepper
      steps={[t("createPage.title")]}
      currentStep={0}
      className="h-full flex flex-col"
    >
      <StepperHeader>
        <StepperPrevious>
          <ChevronLeftIcon className="rtl:rotate-180" />
        </StepperPrevious>

        <div className="flex flex-1 justify-center gap-2">
          <StepperHeaderTitle idx={0}>
            <p>{t("createPage.title")}</p>
          </StepperHeaderTitle>
        </div>

        <Button size="icon" asChild variant="unstyled">
          <SheetClose>
            <X className="h-4 w-4" />
            <span className="sr-only">{t("actions.close")}</span>
          </SheetClose>
        </Button>
      </StepperHeader>

      <StepperSteps className="flex-1 mx-auto my-8 w-[300px] md:w-[600px] max-h-[calc(100vh-200px)] overflow-auto">
        <StepperStep idx={0} className="p-4 rounded-xl bg-white flex flex-col gap-4">
          {!generatedCredentials ? (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">
                  {t("credentialDialog.titleLabel")}
                </label>
                <Input
                  {...register("title")}
                  placeholder={t("credentialDialog.titlePlaceholder")}
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title?.message && (
                  <p className="text-xs text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">
                  {t("credentialDialog.servicesLabel")}
                </label>
                <Controller
                  control={control}
                  name="services"
                  render={({ field }) => (
                    <Select<Option, true>
                      isMulti={true}
                      isSearchable={true}
                      options={serviceOptions}
                      value={serviceOptions.filter((opt) =>
                        field.value?.includes(opt.value as string),
                      )}
                      onChange={(selected) => {
                        field.onChange(
                          selected
                            ? selected.map((opt) => opt.value as string)
                            : [],
                        );
                      }}
                      placeholder={t("credentialDialog.servicesPlaceholder")}
                      error={errors.services?.message}
                    />
                  )}
                />
              </div>

              <Button
                onClick={handleSubmit(handleFormSubmit)}
                disabled={isSubmitting}
                loading={isSubmitting}
                className="self-end"
              >
                {t("credentialDialog.create")}
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                {t("secretDialog.description")}
              </p>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-muted-foreground">
                  {t("columns.apiId")}
                </label>
                <div className="flex items-center gap-2 p-3 bg-muted border rounded-lg">
                  <code
                    className="flex-1 text-sm font-mono break-all select-all"
                    dir="ltr"
                  >
                    {generatedCredentials.apiId}
                  </code>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={copiedField === "apiId" ? "ghost-success" : "ghost"}
                          size="icon"
                          className="h-8 w-8 shrink-0"
                          onClick={() => handleCopy(generatedCredentials.apiId, "apiId")}
                        >
                          {copiedField === "apiId" ? <Check /> : <ContentCopy />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{t("actions.copy")}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-muted-foreground">
                  {t("columns.apiSecret")}
                </label>
                <div className="flex items-center gap-2 p-3 bg-muted border rounded-lg">
                  <code
                    className="flex-1 text-sm font-mono break-all select-all"
                    dir="ltr"
                  >
                    {generatedCredentials.apiSecret}
                  </code>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={copiedField === "apiSecret" ? "ghost-success" : "ghost"}
                          size="icon"
                          className="h-8 w-8 shrink-0"
                          onClick={() => handleCopy(generatedCredentials.apiSecret, "apiSecret")}
                        >
                          {copiedField === "apiSecret" ? <Check /> : <ContentCopy />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{t("actions.copy")}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <div className="flex justify-between gap-2">
                <Button variant="outline" onClick={handleDownload}>
                  <Download />
                  {t("actions.download")}
                </Button>
                <Button onClick={() => router.push("/developers/api-credentials")}>
                  {t("secretDialog.close")}
                </Button>
              </div>
            </>
          )}
        </StepperStep>
      </StepperSteps>
    </Stepper>
  );
};

export default withActiveOrganization(
  withPermission(CreateApiCredentialPage, "completeControlDeveloperTools"),
);
