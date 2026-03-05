"use client";
import CallerIdSelector from "@/components/CallerIdSelector";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Dropzone, {
  DropzoneFileList,
  DropzoneTrigger,
} from "@/components/ui/dropzone";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import Select from "@/components/Select";
import { SOUND_SIZE_LIMIT } from "@/constants/file";
import queryExtensions from "@/queries/queryExtensions";
import {
  AutoDialerUpdateStep2,
  AutoDialerUpdateStep2Schema,
} from "@/validation/AutoDialerUpdateCampaign";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { useFormContext } from "react-hook-form";
import { useTranslations } from "@/providers/TranslationProvider";

type CallDetailsFormProps = {
  onNext: () => void;
};
const CallDetailsForm = ({ onNext }: CallDetailsFormProps) => {
  const tParent = useTranslations("autoDialer.updateCampaign");
  const t = useTranslations(
    "autoDialer.updateCampaign.steps.callsDetails.form",
  );
  const form = useFormContext<AutoDialerUpdateStep2>();
  const { data: extensions } = useLocalizedQuery(queryExtensions({}));

  const {
    watch,
    control,
    formState: { errors },
    clearErrors,
    getValues,
    setError,
    setValue,
    trigger,
  } = form;

  const handleNext = async () => {
    const values = getValues();
    const hasExistingLoopSound = !!values.loopSoundFileName;
    const hasExistingMainSound = !!values.mainSoundFileName;

    const res = await AutoDialerUpdateStep2Schema(tParent)
      .refine(
        (data) => {
          return hasExistingLoopSound || !!data.loopSoundFile;
        },
        {
          path: ["loopSoundFile"],
          message: t("loopSoundFile.validation.required"),
        },
      )
      .refine(
        (data) => {
          const { hasAnnouncement, mainSoundFile } = data;
          if (!hasAnnouncement) return true;
          return hasExistingMainSound || !!mainSoundFile;
        },
        {
          path: ["mainSoundFile"],
          message: t("mainSoundFile.validation.required"),
        },
      )
      .safeParseAsync(values);

    if (!res.success) {
      setTimeout(() => {
        res.error.issues.forEach((issue) => {
          setError(issue.path[0] as keyof AutoDialerUpdateStep2, {
            type: "manual",
            message: issue.message,
          });
        });
      }, 0);

      return;
    }

    clearErrors();
    onNext();
  };

  return (
    <Form {...form}>
      <div className="flex flex-col gap-4">
        <FormField
          control={control}
          name="loopSoundFile"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <div className="">
                  <h3>{t("loopSoundFile.label")}</h3>
                  <Dropzone
                    options={{
                      accept: { "audio/mp3": [".mp3"] },
                      maxSize: SOUND_SIZE_LIMIT,
                      multiple: false,
                      maxFiles: 1,
                    }}
                    value={field.value}
                    onChange={(file) => {
                      field.onChange(file);
                      clearErrors("loopSoundFile");
                      trigger("loopSoundFile");
                    }}
                    fakeFiles={
                      getValues().loopSoundFileName
                        ? [getValues().loopSoundFileName!]
                        : []
                    }
                    removeFakeFile={() => setValue("loopSoundFileName", undefined)}
                  >
                    <DropzoneTrigger />
                    <DropzoneFileList />
                  </Dropzone>
                  <p className="text-destructive">
                    {errors.loopSoundFile?.message}
                  </p>
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="hasAnnouncement"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start gap-2">
              <FormControl>
                <Checkbox
                  checked={!!field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>{t("hasAnnouncement.label")}</FormLabel>
              </div>
            </FormItem>
          )}
        />
        {watch("hasAnnouncement") && (
          <FormField
            control={control}
            name="mainSoundFile"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="">
                    <Dropzone
                      options={{
                        accept: { "audio/mp3": [".mp3"] },
                        maxSize: SOUND_SIZE_LIMIT,
                        multiple: false,
                        maxFiles: 1,
                      }}
                      value={field.value}
                      onChange={(file) => {
                        field.onChange(file);
                        clearErrors("mainSoundFile");
                        trigger("mainSoundFile");
                      }}
                      fakeFiles={
                        getValues().mainSoundFileName
                          ? [getValues().mainSoundFileName!]
                          : []
                      }
                      removeFakeFile={() => setValue("mainSoundFileName", undefined)}
                    >
                      <DropzoneTrigger />
                      <DropzoneFileList />
                    </Dropzone>
                    <p className="text-destructive">
                      {errors.mainSoundFile?.message}
                    </p>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <hr />
        <FormField
          control={control}
          name="agents"
          render={({ field }) => {
            return (
              <FormItem className="flex flex-row items-start gap-2 w-full">
                <FormControl>
                  <Select
                    className="w-full"
                    label={t("agents.label")}
                    error={errors.agents?.message}
                    options={
                      extensions?.map((ext) => ({
                        label: `${ext.name} (${ext.ext})`,
                        value: ext.ext,
                      })) || []
                    }
                    placeholder={t("agents.placeholder")}
                    value={
                      extensions
                        ? extensions
                            .filter((ext) =>
                              Array.isArray(field.value)
                                ? field.value.includes(ext.ext)
                                : false,
                            )
                            .map((ext) => ({
                              label: `${ext.name} (${ext.ext})`,
                              value: ext.ext,
                            }))
                        : []
                    }
                    onChange={(data) => {
                      field.onChange(data.map((d) => d.value));
                      clearErrors("agents");
                      trigger("agents");
                    }}
                    isMulti
                  ></Select>
                </FormControl>
              </FormItem>
            );
          }}
        />

        <hr />

        <FormField
          control={control}
          name="callers"
          render={() => (
            <FormItem className="flex-1">
              <h3>{t("callerIds.label")}</h3>
              <FormControl>
                <CallerIdSelector
                  onChangeCallback={() => {
                    clearErrors("callers");
                    trigger("callers");
                  }}
                />
              </FormControl>
              {errors.callers?.message && (
                <p className="text-destructive mt-2">{errors.callers.message}</p>
              )}
            </FormItem>
          )}
        />

        <Button size="lg" onClick={handleNext} type="button">
          {t("next")}
        </Button>
      </div>
    </Form>
  );
};

export default CallDetailsForm;
