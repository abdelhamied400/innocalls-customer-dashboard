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
import type { CreateSurveyForm } from "../schema";

const CustomersListStep = () => {
  const t = useTranslations("callSurvey.create.form");
  const { control, clearErrors, trigger } =
    useFormContext<CreateSurveyForm>();

  return (
    <div className="flex flex-col gap-6">
      <FormField
        control={control}
        name="customersFile"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("customersFile.label")}</FormLabel>
            <FormControl>
              <Dropzone
                options={{
                  accept: { "text/csv": [".csv"] },
                  multiple: false,
                  maxFiles: 1,
                }}
                value={field.value}
                onChange={(file) => {
                  field.onChange(file);
                  clearErrors("customersFile");
                  trigger("customersFile");
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

export default CustomersListStep;
