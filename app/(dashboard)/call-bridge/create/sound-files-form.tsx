"use client";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import Dropzone, { DropzoneFileList, DropzoneTrigger } from "@/components/ui/dropzone";
import SpinButton from "@/components/ui/spin-button";
import { SOUND_SIZE_LIMIT } from "@/constants/file";
import { CallBridgeCreate } from "@/validation/CallBridgeCreate";
import { useTranslations } from "@/providers/TranslationProvider";

const dropzoneOptions = {
  accept: { "audio/mp3": [".mp3"] },
  maxSize: SOUND_SIZE_LIMIT,
  multiple: false,
  maxFiles: 1,
};

const SoundFilesForm = () => {
  const t = useTranslations("callBridge.create");
  const form = useFormContext<CallBridgeCreate>();
  const {
    control,
    watch,
    clearErrors,
    trigger,
    formState: { errors, isSubmitting },
  } = form;

  const warningSoundFile = watch("warningSoundFile");

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
                    <h3 className="mb-2 font-medium text-sm">
                      {t("form.welcomeSoundFile.label")}
                    </h3>
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
                    <h3 className="mb-2 font-medium text-sm">
                      {t("form.alertSoundFile.label")}
                    </h3>
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
                    <h3 className="mb-2 font-medium text-sm">
                      {t("form.firstRecipientSorrySoundFile.label")}
                    </h3>
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
                    <h3 className="mb-2 font-medium text-sm">
                      {t("form.secondRecipientSorrySoundFile.label")}
                    </h3>
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

        <FormField
          control={control}
          name="warningSoundFile"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <div>
                  <h3 className="mb-2 font-medium text-sm">
                    {t("form.warningSoundFile.label")}
                    <span className="text-muted-foreground font-normal ml-1">
                      {t("form.warningSoundFile.optional")}
                    </span>
                  </h3>
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

        {warningSoundFile && (
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
        )}

        <Button size="lg" type="submit" disabled={isSubmitting}>
          {isSubmitting ? t("form.submitting") : t("form.submit")}
        </Button>
      </div>
    </Form>
  );
};

export default SoundFilesForm;
