"use client";

import { useTranslations } from "@/providers/TranslationProvider";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import apiCredentialService from "@/services/api-credential.service";
import { ApiCredential } from "@/types/api/api-credential";
import {
  UpdateApiCredentialSchema,
  UpdateApiCredentialFormValues,
  API_CREDENTIAL_SERVICES,
} from "@/validation/ApiCredential";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import withActiveOrganization from "@/containers/withActiveOrganization";
import withPermission from "@/containers/withPermission";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import Select, { Option } from "@/components/Select";
import { Skeleton } from "@/components/ui/skeleton";
import Stepper, {
  StepperHeader,
  StepperHeaderTitle,
  StepperPrevious,
  StepperStep,
  StepperSteps,
} from "@/components/ui/stepper";
import { ChevronLeftIcon, X } from "lucide-react";
import { useLocalizedQuery } from "@/hooks/use-localized-query";

const EditApiCredentialPage = () => {
  const t = useTranslations("developers.apiCredentials");
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: credentials = [], isLoading } = useLocalizedQuery({
    queryKey: ["api-credentials"],
    queryFn: apiCredentialService.getAll,
  });

  const credential = credentials.find((c: ApiCredential) => c.id === params.id);

  const serviceOptions: Option[] = API_CREDENTIAL_SERVICES.map((s) => ({
    label: t(`serviceLabels.${s}`),
    value: s,
  }));

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UpdateApiCredentialFormValues>({
    resolver: zodResolver(UpdateApiCredentialSchema(t)),
    values: { services: credential?.services ?? [] },
  });

  const handleFormSubmit = async (data: UpdateApiCredentialFormValues) => {
    try {
      setIsSubmitting(true);
      await apiCredentialService.update(params.id, data.services);

      queryClient.setQueryData<ApiCredential[]>(
        ["api-credentials"],
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.map((c) =>
            c.id === params.id ? { ...c, services: data.services } : c,
          );
        },
      );

      toast.success(t("messages.updateSuccess"));
      router.push("/developers/api-credentials");
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
  withPermission(EditApiCredentialPage, "completeControlDeveloperTools"),
);
