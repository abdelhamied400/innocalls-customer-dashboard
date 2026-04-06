"use client";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useTranslations } from "@/providers/TranslationProvider";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Select from "@/components/Select";
import Dropzone, {
  DropzoneFileList,
  DropzoneTrigger,
} from "@/components/ui/dropzone";
import { SOUND_SIZE_LIMIT } from "@/constants/file";
import { Add, DeleteOutline } from "@mui/icons-material";
import type { CreateSurveyForm } from "../schema";

const ANSWER_TYPES = [
  { label: "1 - 5", value: "one_five" },
  { label: "1 - 10", value: "one_ten" },
  { label: "Yes / No", value: "yes_no" },
];

const QuestionsStep = () => {
  const t = useTranslations("callSurvey.create.form");
  const {
    control,
    clearErrors,
    trigger,
    formState: { errors },
  } = useFormContext<CreateSurveyForm>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  return (
    <div className="flex flex-col gap-6">
      <FormField
        control={control}
        name="maxQuestionAttempts"
        render={({ field }) => (
          <FormItem className="max-w-xs">
            <FormLabel>{t("maxQuestionAttempts.label")}</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={1}
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex items-center justify-between">
        <h4 className="m-0">{t("questions.title")}</h4>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ type: "", sound: null })}
        >
          <Add sx={{ fontSize: 16 }} className="me-1" />
          {t("questions.add")}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {fields.map((field, idx) => (
          <div
            key={field.id}
            className="border rounded-lg p-4 flex flex-col gap-4"
          >
            <div className="flex items-start gap-2">
              <FormField
                control={control}
                name={`questions.${idx}.type`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>{t("questions.answerType.label")}</FormLabel>
                    <FormControl>
                      <Select
                        options={ANSWER_TYPES}
                        value={
                          ANSWER_TYPES.find(
                            (opt) => opt.value === field.value,
                          ) || null
                        }
                        onChange={(opt) => field.onChange(opt?.value || "")}
                        placeholder={t("questions.answerType.placeholder")}
                        error={errors.questions?.[idx]?.type?.message}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost-destructive"
                  size="icon"
                  className="mt-7"
                  onClick={() => remove(idx)}
                >
                  <DeleteOutline fontSize="small" />
                </Button>
              )}
            </div>

            <FormField
              control={control}
              name={`questions.${idx}.sound`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("questions.sound.label")}</FormLabel>
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
                        clearErrors(`questions.${idx}.sound`);
                        trigger(`questions.${idx}.sound`);
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
        ))}
      </div>
    </div>
  );
};

export default QuestionsStep;
