"use client";
import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import Dropzone, { DropzoneFileList, DropzoneTrigger } from "@/components/ui/dropzone";
import SpinButton from "@/components/ui/spin-button";
import { Checkbox } from "@/components/ui/checkbox";
import { SOUND_SIZE_LIMIT } from "@/constants/file";
import { CallBridgeCreate } from "@/validation/CallBridgeCreate";
import { useTranslations } from "@/providers/TranslationProvider";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const dropzoneOptions = {
  accept: { "audio/mp3": [".mp3"] },
  maxSize: SOUND_SIZE_LIMIT,
  multiple: false,
  maxFiles: 1,
};

type SoundFieldHeaderProps = {
  label: string;
  hint?: string;
  optional?: string;
};

const SoundFieldHeader = ({ label, hint, optional }: SoundFieldHeaderProps) => (
  <h3 className="mb-2 font-medium text-sm flex items-center gap-1">
    {label}
    {optional && (
      <span className="text-muted-foreground font-normal">{optional}</span>
    )}
    {hint && (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <Info className="w-3 h-3" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="text-xs w-56 p-2">
            {hint}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )}
  </h3>
);

const SoundFilesForm = () => {
  const t = useTranslations("callBridge.create");
  const form = useFormContext<CallBridgeCreate>();
  const {
    control,
    clearErrors,
    trigger,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const [enableWarningSound, setEnableWarningSound] = useState(false);

  const handleWarningSoundToggle = (checked: boolean) => {
    setEnableWarningSound(checked);
    if (!checked) {
      setValue("warningSoundFile", undefined);
      clearErrors("warningSoundFile");
      clearErrors("warningTimeBeforeEnd");
    }
  };

  return (
    <Form {...form}>
      <div className="flex flex-col gap-6">
        <FormField
            control={control}
            name="welcomeSoundFile"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div>
                    <SoundFieldHeader
                      label={t("form.welcomeSoundFile.label")}
                      hint={t("form.welcomeSoundFile.hint")}
                    />
                    <Dropzone
                      options={dropzoneOptions}
                      value={field.value}
                      onChange={(file) => {
                        field.onChange(file);
                        clearErrors("welcomeSoundFile");
                        trigger("welcomeSoundFile");
                      }}
                    >
                      <DropzoneTrigger />
                      <DropzoneFileList />
                    </Dropzone>
                    <p className="text-destructive text-sm mt-1">
                      {errors.welcomeSoundFile?.message as string}
                    </p>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="alertSoundFile"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div>
                    <SoundFieldHeader
                      label={t("form.alertSoundFile.label")}
                      hint={t("form.alertSoundFile.hint")}
                    />
                    <Dropzone
                      options={dropzoneOptions}
                      value={field.value}
                      onChange={(file) => {
                        field.onChange(file);
                        clearErrors("alertSoundFile");
                        trigger("alertSoundFile");
                      }}
                    >
                      <DropzoneTrigger />
                      <DropzoneFileList />
                    </Dropzone>
                    <p className="text-destructive text-sm mt-1">
                      {errors.alertSoundFile?.message as string}
                    </p>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="firstRecipientSorrySoundFile"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div>
                    <SoundFieldHeader
                      label={t("form.firstRecipientSorrySoundFile.label")}
                      hint={t("form.firstRecipientSorrySoundFile.hint")}
                    />
                    <Dropzone
                      options={dropzoneOptions}
                      value={field.value}
                      onChange={(file) => {
                        field.onChange(file);
                        clearErrors("firstRecipientSorrySoundFile");
                        trigger("firstRecipientSorrySoundFile");
                      }}
                    >
                      <DropzoneTrigger />
                      <DropzoneFileList />
                    </Dropzone>
                    <p className="text-destructive text-sm mt-1">
                      {errors.firstRecipientSorrySoundFile?.message as string}
                    </p>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="secondRecipientSorrySoundFile"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div>
                    <SoundFieldHeader
                      label={t("form.secondRecipientSorrySoundFile.label")}
                      hint={t("form.secondRecipientSorrySoundFile.hint")}
                    />
                    <Dropzone
                      options={dropzoneOptions}
                      value={field.value}
                      onChange={(file) => {
                        field.onChange(file);
                        clearErrors("secondRecipientSorrySoundFile");
                        trigger("secondRecipientSorrySoundFile");
                      }}
                    >
                      <DropzoneTrigger />
                      <DropzoneFileList />
                    </Dropzone>
                    <p className="text-destructive text-sm mt-1">
                      {errors.secondRecipientSorrySoundFile?.message as string}
                    </p>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

        <div className="flex items-center gap-2">
          <Checkbox
            id="enableWarningSound"
            checked={enableWarningSound}
            onCheckedChange={handleWarningSoundToggle}
          />
          <label
            htmlFor="enableWarningSound"
            className="text-sm font-medium flex items-center gap-1 cursor-pointer"
          >
            {t("form.warningSoundFile.label")}
            <span className="text-muted-foreground font-normal">
              {t("form.warningSoundFile.optional")}
            </span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Info className="w-3 h-3" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="text-xs w-56 p-2">
                  {t("form.warningSoundFile.hint")}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </label>
        </div>

        {enableWarningSound && (
          <>
            <FormField
              control={control}
              name="warningSoundFile"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <div>
                      <Dropzone
                        options={dropzoneOptions}
                        value={field.value}
                        onChange={(file) => {
                          field.onChange(file);
                          clearErrors("warningSoundFile");
                          trigger("warningSoundFile");
                        }}
                      >
                        <DropzoneTrigger />
                        <DropzoneFileList />
                      </Dropzone>
                      <p className="text-destructive text-sm mt-1">
                        {errors.warningSoundFile?.message as string}
                      </p>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="warningTimeBeforeEnd"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SpinButton
                      label={t("form.warningTimeBeforeEnd.label")}
                      labelAlign="center"
                      hint={t("form.warningTimeBeforeEnd.hint")}
                      error={errors.warningTimeBeforeEnd?.message}
                      value={field.value ?? 1}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        )}

        <Button size="lg" type="submit" disabled={isSubmitting}>
          {isSubmitting ? t("form.submitting") : t("form.submit")}
        </Button>
      </div>
    </Form>
  );
};

export default SoundFilesForm;
