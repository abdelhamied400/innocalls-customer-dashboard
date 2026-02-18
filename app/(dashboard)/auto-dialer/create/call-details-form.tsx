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
  AutoDialerCreateStep2,
  AutoDialerCreateStep2Schema,
} from "@/validation/AutoDialerCreateCampaign";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { useFormContext } from "react-hook-form";
import { useTranslations } from "@/providers/TranslationProvider";

type CallDetailsFormProps = {
  onNext: () => void;
};
const CallDetailsForm = ({ onNext }: CallDetailsFormProps) => {
  const t = useTranslations(
    "autoDialer.createCampaign.steps.callsDetails.form",
  );
  const form = useFormContext<AutoDialerCreateStep2>();
  const { data: extensions } = useLocalizedQuery(queryExtensions({}));

  const {
    watch,
    control,
    formState: { errors },
    clearErrors,
    getValues,
    setError,
  } = form;

  const handleNext = async () => {
    const res = await AutoDialerCreateStep2Schema(t)
      .refine(
        (data) => {
          const { hasAnnouncement, mainSoundFile } = data;
          return !hasAnnouncement || (hasAnnouncement && mainSoundFile);
        },
        {
          path: ["mainSoundFile"],
          message: t("mainSoundFile.validation.required"),
        },
      )
      .safeParseAsync(getValues());

    if (!res.success) {
      setTimeout(() => {
        res.error.issues.forEach((issue) => {
          setError(issue.path[0] as keyof AutoDialerCreateStep2, {
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
                    onChange={field.onChange}
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
            <FormItem className="flex flex-row items-center gap-2">
              <FormControl>
                <Checkbox
                  checked={!!field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
              </FormControl>
              <div className="leading-none">
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
                      onChange={field.onChange}
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
                    onChange={(data) =>
                      field.onChange(data.map((d) => d.value))
                    }
                    isMulti
                  ></Select>
                </FormControl>
              </FormItem>
            );
          }}
        />

        <hr />

        <div className="flex-1">
          <h3>{t("callerIds.label")}</h3>
          <CallerIdSelector />
          {errors.callers?.message && (
            <p className="text-destructive mt-2">{errors.callers.message}</p>
          )}
        </div>

        <Button size="lg" onClick={handleNext} type="button">
          {t("next")}
        </Button>
      </div>
    </Form>
  );
};

export default CallDetailsForm;
