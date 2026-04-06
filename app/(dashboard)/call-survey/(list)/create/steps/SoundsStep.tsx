"use client";
import { useFormContext } from "react-hook-form";
import { useTranslations } from "@/providers/TranslationProvider";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Dropzone, {
  DropzoneFileList,
  DropzoneTrigger,
} from "@/components/ui/dropzone";
import { SOUND_SIZE_LIMIT } from "@/constants/file";
import type { CreateSurveyForm } from "../schema";

const SoundsStep = () => {
  const t = useTranslations("callSurvey.create.form");
  const { control, clearErrors, trigger } =
    useFormContext<CreateSurveyForm>();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <FormField
        control={control}
        name="startSound"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("startSound.label")}</FormLabel>
            <FormControl>
              <Dropzone
                options={{
                  accept: { "audio/mpeg": [".mp3"] },
                  maxSize: SOUND_SIZE_LIMIT,
                  multiple: false,
                  maxFiles: 1,
                }}
                value={field.value}
                onChange={(file) => {
                  field.onChange(file);
                  clearErrors("startSound");
                  trigger("startSound");
                }}
              >
                <DropzoneTrigger />
                <DropzoneFileList />
              </Dropzone>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="wrongEntrySound"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("wrongEntrySound.label")}</FormLabel>
            <FormControl>
              <Dropzone
                options={{
                  accept: { "audio/mpeg": [".mp3"] },
                  maxSize: SOUND_SIZE_LIMIT,
                  multiple: false,
                  maxFiles: 1,
                }}
                value={field.value}
                onChange={(file) => {
                  field.onChange(file);
                  clearErrors("wrongEntrySound");
                  trigger("wrongEntrySound");
                }}
              >
                <DropzoneTrigger />
                <DropzoneFileList />
              </Dropzone>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="endSound"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("endSound.label")}</FormLabel>
            <FormControl>
              <Dropzone
                options={{
                  accept: { "audio/mpeg": [".mp3"] },
                  maxSize: SOUND_SIZE_LIMIT,
                  multiple: false,
                  maxFiles: 1,
                }}
                value={field.value}
                onChange={(file) => {
                  field.onChange(file);
                  clearErrors("endSound");
                  trigger("endSound");
                }}
              >
                <DropzoneTrigger />
                <DropzoneFileList />
              </Dropzone>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default SoundsStep;
