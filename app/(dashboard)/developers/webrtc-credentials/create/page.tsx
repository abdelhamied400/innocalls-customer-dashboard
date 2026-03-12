"use client";

import { useTranslations } from "@/providers/TranslationProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import webrtcCredentialService from "@/services/webrtc-credential.service";
import {
  WebrtcCredentialSchema,
  WebrtcCredentialFormValues,
} from "@/validation/WebrtcCredential";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import withActiveOrganization from "@/containers/withActiveOrganization";
import withPermission from "@/containers/withPermission";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SheetClose } from "@/components/ui/sheet";
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
import PlusIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/DeleteOutline";

const CreateWebrtcCredentialPage = () => {
  const t = useTranslations("developers.webrtc");
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedApiKey, setGeneratedApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<WebrtcCredentialFormValues>({
    resolver: zodResolver(WebrtcCredentialSchema(t)),
    defaultValues: { domains: [""] },
  });

  const domains = watch("domains");

  const addDomain = () => {
    setValue("domains", [...domains, ""]);
  };

  const removeDomain = (index: number) => {
    setValue(
      "domains",
      domains.filter((_, i) => i !== index),
      { shouldValidate: true },
    );
  };

  const handleFormSubmit = async (data: WebrtcCredentialFormValues) => {
    try {
      setIsSubmitting(true);
      const result = await webrtcCredentialService.create(
        data.domains.map((d) => d.trim()),
      );
      await queryClient.invalidateQueries({ queryKey: ["webrtc-credentials"] });
      toast.success(t("messages.createSuccess"));
      setGeneratedApiKey(result.apiKey);
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

  const handleCopy = async () => {
    if (!generatedApiKey) return;
    await navigator.clipboard.writeText(generatedApiKey);
    setCopied(true);
    toast.success(t("messages.copiedToClipboard"));
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!generatedApiKey) return;
    const blob = new Blob([generatedApiKey], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "webrtc-api-key.txt";
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
          {!generatedApiKey ? (
            <>
              <label className="text-sm font-medium">
                {t("credentialDialog.domainsLabel")}
              </label>
              <div className="flex flex-col gap-2">
                {domains.map((_, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="flex-1">
                      <Input
                        {...register(`domains.${index}`)}
                        placeholder={t("credentialDialog.domainPlaceholder")}
                        className={
                          errors.domains?.[index] ? "border-red-500" : ""
                        }
                      />
                      {errors.domains?.[index]?.message && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.domains[index].message}
                        </p>
                      )}
                    </div>
                    {domains.length > 1 && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost-destructive"
                              size="icon"
                              type="button"
                              className="shrink-0 mt-0.5"
                              onClick={() => removeDomain(index)}
                            >
                              <DeleteIcon />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {t("credentialDialog.removeDomain")}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                ))}
                {errors.domains?.root?.message && (
                  <p className="text-xs text-red-500">
                    {errors.domains.root.message}
                  </p>
                )}
                {errors.domains?.message && (
                  <p className="text-xs text-red-500">
                    {errors.domains.message}
                  </p>
                )}
                <Button
                  variant="link"
                  onClick={addDomain}
                  type="button"
                  className="self-start"
                >
                  <PlusIcon />
                  {t("credentialDialog.addDomain")}
                </Button>
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
                {t("apiKeyDialog.description")}
              </p>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-muted-foreground">
                  {t("columns.apiKey")}
                </label>
                <div className="flex items-center gap-2 p-3 bg-muted border rounded-lg">
                  <code className="flex-1 text-sm font-mono break-all select-all">
                    {generatedApiKey}
                  </code>
                  <div className="flex items-center gap-1 shrink-0">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={copied ? "ghost-success" : "ghost"}
                            size="icon"
                            className="h-8 w-8"
                            onClick={handleCopy}
                          >
                            {copied ? <Check /> : <ContentCopy />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {copied
                            ? t("messages.copiedToClipboard")
                            : t("actions.copy")}
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={handleDownload}
                          >
                            <Download />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{t("actions.download")}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>

              <Button
                className="self-end"
                onClick={() => router.push("/developers/webrtc-credentials")}
              >
                {t("apiKeyDialog.close")}
              </Button>
            </>
          )}
        </StepperStep>
      </StepperSteps>
    </Stepper>
  );
};

export default withActiveOrganization(
  withPermission(CreateWebrtcCredentialPage, "completeControlDeveloperTools"),
);
