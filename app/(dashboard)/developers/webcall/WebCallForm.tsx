"use client";

import { useTranslations } from "@/providers/TranslationProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { WebCallAppSchema, WebCallAppFormValues } from "@/validation/WebCallApp";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Field from "@/components/ui/field";
import { Plus, Trash2 } from "lucide-react";
import WebCallPreview from "./WebCallPreview";
import Select from "@/components/Select";
import { useVocab } from "@/hooks/useVocab";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type SelectOption = {
  label: string;
  value: string;
};

type WebCallFormProps = {
  defaultValues?: WebCallAppFormValues;
  onSubmit: (data: WebCallAppFormValues) => Promise<void>;
  isSubmitting: boolean;
  isEdit?: boolean;
};

const WebCallForm = ({
  defaultValues,
  onSubmit,
  isSubmitting,
  isEdit = false,
}: WebCallFormProps) => {
  const t = useTranslations("developers.webcall");
  const { dids } = useVocab();

  const didOptions: SelectOption[] = dids.map((did) => ({
    label: did.name,
    value: did.id,
  }));

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<WebCallAppFormValues>({
    resolver: zodResolver(WebCallAppSchema(t)),
    defaultValues: defaultValues ?? {
      iconText: "Call Us",
      iconBackgroundColor: "#8d8080",
      iconBaseColor: "#ad9d9d",
      iconFontColor: "#ffffff",
      concurrentCalls: 10,
      destinationNumber: "",
      callerId: "",
      domains: [""],
    },
  });

  const watchedIconText = watch("iconText");
  const watchedBgColor = watch("iconBackgroundColor");
  const watchedBaseColor = watch("iconBaseColor");
  const watchedFontColor = watch("iconFontColor");
  const watchedCallerId = watch("callerId");
  const watchedDomains = watch("domains");

  const addDomain = () => {
    setValue("domains", [...watchedDomains, ""]);
  };

  const removeDomain = (index: number) => {
    const current = getValues("domains");
    setValue(
      "domains",
      current.filter((_, i) => i !== index),
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Preview */}
      <div className="bg-gray-100 border border-dashed rounded-lg p-8">
        <WebCallPreview
          iconText={watchedIconText}
          iconBackgroundColor={watchedBgColor || "#4CAF50"}
          iconBaseColor={watchedBaseColor || "#FFFFFF"}
          iconFontColor={watchedFontColor || "#000000"}
        />
      </div>

      {/* Style Section */}
      <div className="border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">{t("form.sections.style")}</h2>

        <Field label={t("form.fields.iconText")} error={errors.iconText?.message}>
          <Input
            variant="field"
            {...register("iconText")}
            placeholder={t("form.placeholders.iconText")}
          />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-sm mb-1.5 block">{t("form.fields.backgroundColor")}</Label>
            <Input
              type="color"
              className="h-10 w-full cursor-pointer"
              {...register("iconBackgroundColor")}
            />
            {errors.iconBackgroundColor && (
              <p className="text-sm text-red-500 mt-1">{errors.iconBackgroundColor.message}</p>
            )}
          </div>
          <div>
            <Label className="text-sm mb-1.5 block">{t("form.fields.iconBaseColor")}</Label>
            <Input
              type="color"
              className="h-10 w-full cursor-pointer"
              {...register("iconBaseColor")}
            />
            {errors.iconBaseColor && (
              <p className="text-sm text-red-500 mt-1">{errors.iconBaseColor.message}</p>
            )}
          </div>
          <div>
            <Label className="text-sm mb-1.5 block">{t("form.fields.fontColor")}</Label>
            <Input
              type="color"
              className="h-10 w-full cursor-pointer"
              {...register("iconFontColor")}
            />
            {errors.iconFontColor && (
              <p className="text-sm text-red-500 mt-1">{errors.iconFontColor.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Configuration Section */}
      <div className="border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">{t("form.sections.configuration")}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select<SelectOption, false>
            label={t("form.fields.callerId")}
            options={didOptions}
            value={
              watchedCallerId
                ? didOptions.find((opt) => opt.value === watchedCallerId) || null
                : null
            }
            onChange={(option) => {
              setValue("callerId", option?.value?.toString() || "", {
                shouldValidate: true,
              });
            }}
            placeholder={t("form.placeholders.callerId")}
            error={errors.callerId?.message}
          />

          <Field
            label={t("form.fields.destinationNumber")}
            error={errors.destinationNumber?.message}
          >
            <Input
              variant="field"
              {...register("destinationNumber")}
              placeholder={t("form.placeholders.destinationNumber")}
              dir="ltr"
            />
          </Field>
        </div>

        <Field
          label={t("form.fields.concurrentCalls")}
          error={errors.concurrentCalls?.message}
        >
          <Input
            variant="field"
            type="number"
            min={1}
            {...register("concurrentCalls", { valueAsNumber: true })}
            placeholder={t("form.placeholders.concurrentCalls")}
            dir="ltr"
          />
        </Field>
      </div>

      {/* Domains Section */}
      <div className="border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">{t("form.sections.domains")}</h2>

        <div className="space-y-2">
          {watchedDomains.map((_, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="flex-1">
                <Field
                  error={errors.domains?.[index]?.message}
                >
                  <Input
                    variant="field"
                    {...register(`domains.${index}`)}
                    placeholder={t("form.placeholders.domain")}
                    dir="ltr"
                  />
                </Field>
              </div>
              {watchedDomains.length > 1 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost-destructive"
                        size="icon"
                        className="mt-1"
                        onClick={() => removeDomain(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{t("form.removeDomain")}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="link"
          onClick={addDomain}
        >
          <Plus className="h-4 w-4" />
          {t("form.addDomain")}
        </Button>
        {errors.domains?.root?.message && (
          <p className="text-sm text-red-500">{errors.domains.root.message}</p>
        )}
        {errors.domains?.message && (
          <p className="text-sm text-red-500">{errors.domains.message}</p>
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
          {isEdit ? t("form.update") : t("form.create")}
        </Button>
      </div>
    </form>
  );
};

export default WebCallForm;
