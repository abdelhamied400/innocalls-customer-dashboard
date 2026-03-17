"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Select, { Option } from "@/components/Select";
import { useTranslations } from "@/providers/TranslationProvider";
import {
  CreateApiCredentialSchema,
  UpdateApiCredentialSchema,
  CreateApiCredentialFormValues,
  UpdateApiCredentialFormValues,
  API_CREDENTIAL_SERVICES,
} from "@/validation/ApiCredential";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";

type ApiCredentialDialogProps =
  | {
      open: boolean;
      onClose: () => void;
      onSubmit: (data: { title: string; services: string[] }) => Promise<void>;
      isEdit?: false;
      initialServices?: string[];
      isSubmitting?: boolean;
    }
  | {
      open: boolean;
      onClose: () => void;
      onSubmit: (data: { services: string[] }) => Promise<void>;
      isEdit: true;
      initialServices?: string[];
      isSubmitting?: boolean;
    };

const ApiCredentialDialog = ({
  open,
  onClose,
  onSubmit,
  isEdit = false,
  initialServices = [],
  isSubmitting = false,
}: ApiCredentialDialogProps) => {
  const t = useTranslations("developers.apiCredentials");

  const serviceOptions: Option[] = API_CREDENTIAL_SERVICES.map((s) => ({
    label: t(`serviceLabels.${s}`),
    value: s,
  }));

  const schema = isEdit
    ? UpdateApiCredentialSchema(t)
    : CreateApiCredentialSchema(t);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateApiCredentialFormValues | UpdateApiCredentialFormValues>({
    resolver: zodResolver(schema),
    defaultValues: isEdit
      ? { services: initialServices }
      : { title: "", services: [] },
  });

  const prevOpen = useRef(open);
  const initialServicesKey = JSON.stringify(initialServices);

  useEffect(() => {
    if (open && !prevOpen.current) {
      reset(
        isEdit
          ? { services: [...initialServices] }
          : { title: "", services: [] },
      );
    }
    prevOpen.current = open;
  }, [open, initialServicesKey]);

  const onFormSubmit = async (
    data: CreateApiCredentialFormValues | UpdateApiCredentialFormValues,
  ) => {
    if (isEdit) {
      await (onSubmit as (data: { services: string[] }) => Promise<void>)({
        services: data.services,
      });
    } else {
      await (
        onSubmit as (data: {
          title: string;
          services: string[];
        }) => Promise<void>
      )(data as CreateApiCredentialFormValues);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && onClose()}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isEdit
              ? t("credentialDialog.editTitle")
              : t("credentialDialog.createTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isEdit
              ? t("credentialDialog.editDescription")
              : t("credentialDialog.createDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-4">
          {!isEdit && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">
                {t("credentialDialog.titleLabel")}
              </label>
              <Input
                {...register("title" as any)}
                placeholder={t("credentialDialog.titlePlaceholder")}
                className={
                  (errors as any).title ? "border-red-500" : ""
                }
              />
              {(errors as any).title?.message && (
                <p className="text-xs text-red-500">
                  {(errors as any).title.message}
                </p>
              )}
            </div>
          )}

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
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>
            {t("confirmations.cancel")}
          </AlertDialogCancel>
          <Button
            onClick={handleSubmit(onFormSubmit)}
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            {isEdit
              ? t("credentialDialog.update")
              : t("credentialDialog.create")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ApiCredentialDialog;
