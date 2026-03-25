"use client";

import { Button } from "@/components/ui/button";
import Field from "@/components/ui/field";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SheetClose } from "@/components/ui/sheet";
import Stepper, {
  StepperHeader,
  StepperHeaderTitle,
  StepperPrevious,
  StepperStep,
  StepperSteps,
} from "@/components/ui/stepper";
import { toast } from "sonner";
import { useTranslations } from "@/providers/TranslationProvider";
import vocabService from "@/services/vocab.service";
import { CreateTagFormValues, CreateTagSchema } from "@/validation/CreateTag";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { ChevronLeftIcon, X } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

const CreateTagForm = () => {
  const queryClient = useQueryClient();
  const closeSheetRef = useRef<HTMLButtonElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const t = useTranslations("settings.call.createTag");

  const form = useForm<CreateTagFormValues>({
    resolver: zodResolver(CreateTagSchema(t)),
    defaultValues: {
      nameAR: "",
      nameEN: "",
    },
  });

  const {
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await vocabService.createTag(data);

      toast.success(t("messages.createSuccess"));

      closeSheetRef.current?.click();
      queryClient.invalidateQueries({ queryKey: ["call-tags"] });
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(t("messages.createFailed"), {
          description: error.response?.data?.message,
        });
      } else {
        toast.error(t("messages.createFailed"));
      }
    }
  });

  return (
    <Stepper
      steps={[t("title")]}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      className="h-full flex flex-col"
    >
      <StepperHeader>
        <StepperPrevious>
          <ChevronLeftIcon />
        </StepperPrevious>

        <div className="flex flex-1 justify-center gap-2">
          <StepperHeaderTitle idx={0}>
            <p>{t("title")}</p>
          </StepperHeaderTitle>
        </div>
        <Button size="icon" asChild variant="unstyled">
          <SheetClose ref={closeSheetRef}>
            <X className="h-4 w-4" />
            <span className="sr-only">{t("actions.close")}</span>
          </SheetClose>
        </Button>
      </StepperHeader>

      <StepperSteps className="flex-1 mx-auto my-8 w-[300px] md:w-[600px] max-h-[calc(100vh-200px)] overflow-auto">
        <Form {...form}>
          <form onSubmit={onSubmit} className="h-full">
            <StepperStep
              idx={0}
              className="p-4 rounded-xl bg-white flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="nameAR"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Field
                        label={t("form.fields.nameAR.label")}
                        error={errors.nameAR?.message}
                        htmlFor="nameAR"
                      >
                        <Input
                          id="nameAR"
                          variant="field"
                          placeholder={t("form.fields.nameAR.placeholder")}
                          {...field}
                        />
                      </Field>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nameEN"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Field
                        label={t("form.fields.nameEN.label")}
                        error={errors.nameEN?.message}
                        htmlFor="nameEN"
                      >
                        <Input
                          id="nameEN"
                          variant="field"
                          placeholder={t("form.fields.nameEN.placeholder")}
                          {...field}
                        />
                      </Field>
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                {t("actions.create")}
              </Button>
            </StepperStep>
          </form>
        </Form>
      </StepperSteps>
    </Stepper>
  );
};

export default CreateTagForm;
