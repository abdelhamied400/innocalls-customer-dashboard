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
import { Input } from "@/components/ui/input";
import type { CreateSurveyForm } from "../schema";

const SurveyDetailsStep = () => {
  const t = useTranslations("callSurvey.create.form");
  const { control } = useFormContext<CreateSurveyForm>();

  return (
    <div className="flex flex-col gap-6">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("name.label")}</FormLabel>
            <FormControl>
              <Input placeholder={t("name.placeholder")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="trialsCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("trialsCount.label")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="concurrencyCalls"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("concurrencyCalls.label")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="delayMinutesBetweenTrials"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("delayMinutesBetweenTrials.label")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={5}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="dtmfTimeout"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("dtmfTimeout.label")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={5}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default SurveyDetailsStep;
