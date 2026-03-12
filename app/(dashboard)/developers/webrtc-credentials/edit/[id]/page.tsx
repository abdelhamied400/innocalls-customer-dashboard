"use client";

import { useTranslations } from "@/providers/TranslationProvider";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import webrtcCredentialService from "@/services/webrtc-credential.service";
import { WebRTCCredential } from "@/types/api/webrtc-credential";
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
import { Skeleton } from "@/components/ui/skeleton";
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
import PlusIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import { useLocalizedQuery } from "@/hooks/use-localized-query";

const EditWebrtcCredentialPage = () => {
  const t = useTranslations("developers.webrtc");
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: credentials = [], isLoading } = useLocalizedQuery({
    queryKey: ["webrtc-credentials"],
    queryFn: webrtcCredentialService.getAll,
  });

  const credential = credentials.find(
    (c: WebRTCCredential) => c.id === params.id,
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<WebrtcCredentialFormValues>({
    resolver: zodResolver(WebrtcCredentialSchema(t)),
    values: {
      domains:
        credential?.domains && credential.domains.length > 0
          ? credential.domains
          : [""],
    },
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
      await webrtcCredentialService.update(
        params.id,
        data.domains.map((d) => d.trim()),
      );

      queryClient.setQueryData<WebRTCCredential[]>(
        ["webrtc-credentials"],
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.map((c) =>
            c.id === params.id ? { ...c, domains: data.domains } : c,
          );
        },
      );

      await queryClient.invalidateQueries({ queryKey: ["webrtc-credentials"] });
      toast.success(t("messages.updateSuccess"));
      router.push("/developers/webrtc-credentials");
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(t("messages.updateFailed"), {
          description: error.response?.data?.message,
        });
      } else {
        toast.error(t("messages.updateFailed"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stepper
      steps={[t("editPage.title")]}
      currentStep={0}
      className="h-full flex flex-col"
    >
      <StepperHeader>
        <StepperPrevious>
          <ChevronLeftIcon className="rtl:rotate-180" />
        </StepperPrevious>

        <div className="flex flex-1 justify-center gap-2">
          <StepperHeaderTitle idx={0}>
            <p>{t("editPage.title")}</p>
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
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          )}
          {!isLoading && (
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
                {t("credentialDialog.update")}
              </Button>
            </>
          )}
        </StepperStep>
      </StepperSteps>
    </Stepper>
  );
};

export default withActiveOrganization(
  withPermission(EditWebrtcCredentialPage, "completeControlDeveloperTools"),
);
